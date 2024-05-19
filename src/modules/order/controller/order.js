import couponModel from "../../../../DB/model/Coupon.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import productModel from "../../../../DB/model/Product.model.js"
import orderModel from "../../../../DB/model/Order.model.js"
import cartModel from "../../../../DB/model/Cart.model.js"
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import path from 'path'
import Stripe from 'stripe'
import { sendEmail } from "../../../utils/email.js"
import { createInvoice } from "../../../utils/createInvoice.js"
import fs from 'fs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const createOrder = async (req, res, next) => {
    let { products, address, phone, note, coupon, orderPaymentMethod } = req.body
    const userId = req.user._id
    if (coupon) {
        const isCouponExist = await couponModel.findOne({
            code: coupon,
        })
        if (!isCouponExist) return next(new ErrorClass("in-valid coupon!", 404))
        if (isCouponExist.expiryDate < Date.now()) return next(new ErrorClass("Coupon expired!", 410))
        if (isCouponExist.usedBy.length > isCouponExist.noOfUses) return next(new ErrorClass("This coupon exceeded the usage limit", 410))
        if (isCouponExist.usedBy.includes(req.user._id)) return next(new ErrorClass("You've already claimed this coupon", 410))
        req.body.coupon = isCouponExist
    }
    let existingProducts = []
    let foundedIds = []
    let price = 0
    if (!req.body.products) {
        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart.products.length) {
            return next(new ErrorClass('cart is empty', 410))
        }
        products = cart.products
    }
    for (const product of products) {
        const checkProduct = await productModel.findById(product.productId)
        if (!checkProduct || checkProduct.stock < product.quantity) {
            return next(new ErrorClass(`product ${product.productId} not found or not enough stock! stock available is ${checkProduct.stock}`, 404))
        }
        checkProduct.stock -= product.quantity
        await checkProduct.save()
        existingProducts.push({
            product: {
                name: checkProduct.name,
                price: checkProduct.price,
                paymentPrice: checkProduct.paymentPrice,
                productId: checkProduct._id
            },
            quantity: product.quantity
        })
        foundedIds.push(checkProduct._id)
        price += checkProduct.paymentPrice * product.quantity
    }


    const orderPaymentPrice = price - (price * ((req.body.coupon?.amountOfDiscount || 0) / 100))
    const order = await orderModel.create({
        products: existingProducts,
        address,
        phone,
        note,
        coupon: req.body.coupon?._id,
        orderPaymentMethod,
        orderPrice: price,
        orderPaymentPrice,
        status: orderPaymentMethod == 'card' ? "pending" : 'placed',
        userId
    })
    const invoice = {
        customer: {
            id: order._id,
            email: req.user.email,
            totalPrice: orderPaymentPrice,
            name: req.user.name,
            address
        },
        items: existingProducts.map(product => {
            return {
                item: product.product.name,
                description: product.product.description,
                quantity: product.quantity,
                amount: product.product.paymentPrice * 100
            }
        }),
        subtotal: price,
    }
    const pdfPath = path.join(__dirname, `../../../utils/pdf/${req.user._id}.pdf`)
    createInvoice(invoice, pdfPath);
    await sendEmail({
        to: req.user.email, subject: "Invoice", attachments: [{
            filename: 'order invoice',
            path: pdfPath,
            contentType: 'application/pdf'
        }]
    })
    fs.unlinkSync(pdfPath)
    if (orderPaymentMethod == 'card') {
        if (req.body.coupon) {
            const coupon = await stripe.coupons.create({
                percent_off: req.body.coupon.amountOfDiscount,
                duration: 'once'
            })
            req.body.stripeCoupon = coupon.id
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            metadata: {
                orderId: order._id.toString()
            },
            customer_email: req.user.email,
            cancel_url: `https://www.google.com/`,
            success_url: `${req.protocol}s://${req.headers.host}/order/successUrl`,
            discounts: req.body.stripeCoupon ? [{ coupon: req.body.stripeCoupon }] : [],
            line_items: existingProducts.map(ele => {
                return {
                    price_data: {
                        currency: 'EGP',
                        product_data: {
                            name: ele.product.name,
                        },
                        unit_amount: ele.product.paymentPrice * 100
                    },
                    quantity: ele.quantity
                }
            })
        })
        if (req.body.coupon) {
            await couponModel.updateOne({ code: coupon },
                {
                    $addToSet: {
                        usedBy: req.user._id
                    },
                }
            )
        }
        if (!req.body.products) {
            await cartModel.updateOne({ userId: req.user._id }, {
                $pull: {
                    products: {
                        productId: {
                            $in: foundedIds
                        }
                    }
                }
            })
        } else {
            await cartModel.updateOne({ userId: req.user._id }, { products: [] })
        }
        return res.status(201).json({ message: "Done!", order, session })
    }

    //
    if (req.body.coupon) {
        await couponModel.updateOne({ code: coupon },
            {
                $addToSet: {
                    usedBy: req.user._id
                },
            }
        )
    }
    if (!req.body.products) {
        await cartModel.updateOne({ userId: req.user._id }, {
            $pull: {
                products: {
                    productId: {
                        $in: foundedIds
                    }
                }
            }
        })
    } else {
        await cartModel.updateOne({ userId: req.user._id }, { products: [] })
    }



    return res.status(201).json({ message: "Done!", order })
}

export const webhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.END_POINT_SECRET);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object.metadata;
            // Then define and call a function to handle the event checkout.session.completed
            const order = await orderModel.findByIdAndUpdate(checkoutSessionCompleted.orderId, {
                status: 'placed'
            }, { new: true })
            res.status(200).json({ order })
            break;
        // ... handle other event types
        default:
            return next(new ErrorClass(`Unhandled event type ${event.type}`, 402));
    }
}

export const cancelOrder = async (req, res, next) => {
    const orderId = req.params.id
    const userId = req.user._id
    const { reason } = req.body
    const isOrderExist = await orderModel.findOne({ _id: orderId, userId })
    if (!isOrderExist) return next(new ErrorClass("this order doesn't exist or you do not own this order!", 404))
    //checking if the order is already delievered
    if(isOrderExist.status=='delivered')return next(new ErrorClass("this order has already been delivered", 403))
    //updating this order as canceled and putting a reason for it
    await orderModel.findByIdAndUpdate(orderId, { status: 'canceled', reason })
    return res.status(200).json({message:"Done!"})
}

export const getMyOrders = async(req,res,next)=>{
    const userId = req.user._id
    //using $nin to execlude canceled and delievered products
    const orders = await orderModel.find({userId,status:{$nin : ['canceled','delivered']}}).select('address orderPaymentPrice products status')
    if(orders.length==0)return next(new ErrorClass("no orders were found for this user",404))
    return res.status(200).json({message:"Done!",orders})
}

export const successUrl = async (req, res, next) => {
    res.send(`<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title></title>
        <link href='https://fonts.googleapis.com/css?family=Lato:300,400|Montserrat:700' rel='stylesheet' type='text/css'>
        <style>
            @import url(//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css);
            @import url(//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css);
        </style>
        <link rel="stylesheet" href="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/default_thank_you.css">
        <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/jquery-1.9.1.min.js"></script>
        <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/html5shiv.js"></script>
    </head>
    <body>
        <header class="site-header" id="header">
            <h1 class="site-header__title" data-lead-id="site-header-title">THANK YOU!</h1>
        </header>
    
        <div class="main-content">
            <i class="fa fa-check main-content__checkmark" id="checkmark"></i>
            <p class="main-content__body" data-lead-id="main-content-body">Thanks for buying from our website.<br> an email will find you shortly with your order details!</p>
        </div>
    
        <footer class="site-footer" id="footer">
            <p class="site-footer__fineprint" id="fineprint">E-Commerce By Ali</p>
        </footer>
    </body>
    </html>`)
}
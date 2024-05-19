import cartModel from "../../../../DB/model/Cart.model.js"
import productModel from "../../../../DB/model/Product.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"


export const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new ErrorClass("product not found", 404))
    }

    //checking if the quantity the user asked for is more than the stock available
    if (quantity > product.stock) {
        await productModel.updateOne({ _id: productId }, {
            $addToSet: {
                wishList: req.user._id
            }
        })
        return next(new ErrorClass("Out of stock!", 400))
    }

    const cart = await cartModel.findOne({ userId: req.user._id })
    //trying to find the index for that product if it exists in the cart
    const index = cart.products.findIndex(ele => {
        return ele.productId == productId
    })
    //if item isnt found in the cart its added
    if (index == -1) {
        cart.products.push({
            productId: productId,
            quantity
        })
        //if its found the quantity is increased
    } else {
        cart.products[index].quantity = quantity
    }

    //then we save the changes done to the cart
    await cart.save()
    return res.status(200).json({ message: "Done!", cart })
}

export const getCart = async (req, res, next) => {
    const userId = req.user._id
    const cart = await cartModel.findOne({ userId }).populate({
        path: 'products.productId',
        select: 'name stock paymentPrice'
    })

    let totalPrice = 0
    cart.products = cart.products.filter(ele => {
        if (ele.productId && ele.productId.stock) {
            if (ele.productId.stock < ele.quantity) {
                ele.quantity = ele.productId.stock
            }
            totalPrice += (ele.quantity * ele.productId.paymentPrice)
            return ele
        }
    })
    await cart.save()
    return res.status(418).json({ message: "Done!", cart })
}
import orderModel from "../../../../DB/model/Order.model.js"
import productModel from "../../../../DB/model/Product.model.js"
import reviewModel from "../../../../DB/model/Review.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"


export const addReview = async (req, res, next) => {
    const createdBy = req.user._id
    const { rating, comment, productId } = req.body
    const product = await productModel.findById(productId)
    if (!product) return next(new ErrorClass("product not found!", 404))
    const alreadyReviewed = await reviewModel.findOne({
        createdBy: createdBy,
        productId: productId
    })


    if (alreadyReviewed) return next(new ErrorClass("you already reviewed this product!", 409))
    const order = await orderModel.findOne({
        userId: createdBy,
        status: 'delivered',
        'products.product.productId': productId
    })
    if (!order) return next(new ErrorClass("you are not authorized to review this order!", 403))

    const review = await reviewModel.create({ rating, comment, productId, createdBy })

    // const reviews = await reviewModel.find({ productId })

    // let sum = 0
    // for (const review of reviews) {
    //     sum += review.rating
    // }
    // const avg = sum / reviews.length + 1
    // product.avgRate = avg
    // product.rateNo += 1

    const newAvg = ((product.avgRate * product.rateNo) + rating) / (product.rateNo + 1)
    product.avgRate = newAvg
    product.rateNo = product.rateNo + 1
    await product.save()
    return res.status(202).json({ message: "Done!", review })
}

export const getReviewsPerUser = async (req, res, next) => {
    const productId = req.params.id
    const review = await reviewModel.find({ productId }).populate([
        {
            path: 'createdBy',
            select: 'name email image phone'
        }, {
            path: 'productId'
        }
    ])
    return res.status(200).json(review)
}

export const updateReview = async (req, res, next) => {
    const createdBy = req.user._id
    const reviewId = req.params.id
    const { comment, rating } = req.body

    const isReviewd = await reviewModel.findOne({ _id: reviewId, createdBy })
    if (!isReviewd) return next(new ErrorClass("this review does not exist!", 404))

    const product = await productModel.findById(isReviewd.productId)
    if (rating && rating != isReviewd.rating) {
        const newAvg = ((product.avgRate * product.rateNo) + rating) / (product.rateNo + 1)
        product.avgRate = newAvg
        isReviewd.rating = rating
        await product.save()
    }
    if (comment) isReviewd.comment = comment
    await isReviewd.save()


    res.status(200).json({ message: "Done!", review: isReviewd })
}

export const deleteReview = async (req, res, next) => {
    const createdBy = req.user._id
    const reviewId = req.params.id

    const isReviewd = await reviewModel.findOneAndDelete({ _id: reviewId, createdBy })
    if (!isReviewd) return next(new ErrorClass("this review does not exist!", 404))

    const product = await productModel.findById(isReviewd.productId)
    if (rating) {
        const newAvg = product.rateNo ? 0 : ((product.avgRate * product.rateNo) - isReviewd.rating) / (product.rateNo - 1)
        product.avgRate = newAvg
        product.rateNo -= 1
        await product.save()
    }
    if (comment) isReviewd.comment = comment
    await isReviewd.save()


    res.status(200).json({ message: "Done!", review: isReviewd })
}
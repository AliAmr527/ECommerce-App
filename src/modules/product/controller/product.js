import categoryModel from "../../../../DB/model/Category.model.js"
import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import brandModel from "../../../../DB/model/Brand.model.js"
import productModel from "../../../../DB/model/Product.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import slugify from "slugify"
import cloudinary from "../../../utils/cloudinary.js"
import qrcode from "qrcode"
import { apiFeatures } from "../../../utils/apiFeatures.js"


export const addProduct = async (req, res, next) => {
    const isNameExist = await productModel.findOne({ name: req.body.name })
    req.body.createdBy = req.user._id
    if (isNameExist) {
        isNameExist.stock += Number(req.body.stock)
        await isNameExist.save()
        return res.status(201).json({
            message: "Increased Quantity of existing product", productName: isNameExist.name,
            productStock: isNameExist.stock,
        })
    }

    const isCategoryExist = await categoryModel.findById(req.body.categoryId)
    if (!isCategoryExist) {
        return next(new ErrorClass(`The Category with Id ${req.body.categoryId} doesn't exist`, 404))
    }
    const isSubcategoryExist = await subcategoryModel.findOne({ _id: req.body.subcategoryId, categoryId: req.body.categoryId })
    if (!isSubcategoryExist) {
        return next(new ErrorClass(`The Subcategory with Id ${req.body.subcategoryId} doesn't exist or it doesn't belong to requested category`, 404))
    }
    const isBrandExist = await brandModel.findById(req.body.brandId)
    if (!isBrandExist) {
        return next(new ErrorClass(`The Brand with Id ${req.body.brandId} doesn't exist`, 404))
    }
    if (req.body.size) {
        req.body.size = JSON.parse(req.body.size)
    }
    if (req.body.color) {
        req.body.color = JSON.parse(req.body.color)
    }

    //slugifying the name
    req.body.slug = slugify(req.body.name)
    //computing discount if it is found to the payment price
    req.body.paymentPrice = req.body.price - (req.body.price * ((req.body.discount || 0) / 100))
    //putting image in the req
    const img = await cloudinary.uploader.upload(req.files.image[0].path, { folder: `${cloudinaryFolder}/product/images` })
    req.body.image = { secure_url: img.secure_url, public_id: img.public_id }
    //putting coverimages in the req one at a time
    if (req.files.coverImage?.length) {
        const images = []
        for (let file of req.files.coverImage) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${cloudinaryFolder}/product/coverPhotos` })
            images.push({ secure_url, public_id })
        }
        req.body.coverImage = images
    }
    req.body.QrCode = await qrcode.toDataURL(JSON.stringify({
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.image.secure_url,
        Price: req.body.paymentPrice
    }))

    const product = await productModel.create(req.body)
    return res.status(202).json({ message: "Done!", product })
}

export const getProducts = async (req, res, next) => {
    let features = new apiFeatures(productModel.find(), req.query).pagination().filter().search().sort().select()
    const products1 = await features.mongooseQuery
    //to calculate number of products
    let featuresForProductNumbers = new apiFeatures(productModel.find(), req.query).numberOfProducts()
    const numberOfProducts = await featuresForProductNumbers.mongooseQuery
    var numberOfPages = 1
    if (req.query.size) {
        numberOfPages = Math.ceil(numberOfProducts / req.query.size)
    }
    return res.json({ message: "Done!", numberOfPages, numberOfProducts, products: products1 })

    ////////////////////*old api features included in class*///////////////////////////
    // const { skip, limit } = paginate(page, size)
    // const exclude = ["sort", "page", "size", "fields", "searchKey"] //creates a constant without page or sort etc to be able to find with in collection
    // let queryFields = { ...req.query }
    // exclude.forEach(ele => {
    //     delete queryFields[ele]
    // })
    // queryFields = JSON.stringify(queryFields).replace(/lte|lt|gte|gt/g, (match) => {
    //     return `$${match}`
    // })
    // queryFields = JSON.parse(queryFields)
    // let reqQuery = productModel.find(queryFields)
    // reqQuery.skip(skip).limit(limit)
    // 
    // reqQuery.select(req.query.fields.replace(/,/g, " "))
    // 
    // reqQuery.sort(req.query.sort?.replace(/,/g, " "))
    // 
    // reqQuery.find({$or:[{ name: { $regex: req.query.searchKey || "" } },{ description: { $regex: req.query.searchKey || "" } }]})
    // const products = await reqQuery
    // const productCount = await productModel.find({$or:[{ name: { $regex: req.query.searchKey || "" } },{ description: { $regex: req.query.searchKey || "" } }]}, queryFields).count()
    // const numberOfPages = Math.ceil(productCount / limit)
    // return res.status(200).json({ message: "Done!", numberOfPages, productCount, products })
}

export const updateProduct = async (req, res, next) => {
    const { productId } = req.params
    req.body.createdBy = req.user._id
    const isProductExist = await productModel.findById(productId)
    if (!isProductExist) return next(new ErrorClass("product not found!", 404))
    //checks if there is another product with the same name but different id in database
    const duplicateName = await productModel.findOne({ name: req.body.name, _id: { $ne: productId } })
    if (duplicateName) return next(new ErrorClass("the name you chose for this product already exists for another!", 404))

    //checking if these exist

    let reqQuery = { ...req.body }
    let obj = ["name", "secription", "image", "paymentPrice", "categoryId"]
    obj.forEach(ele => {
        if (reqQuery[ele] == undefined) {
            reqQuery[ele] = null
        }
    })

    if (typeof (req.body.categoryId) !== "undefined") {
        const isCategoryExist = await categoryModel.findById(req.body.categoryId)
        if (!isCategoryExist) {
            return next(new ErrorClass(`The Category with Id ${req.body.categoryId} doesn't exist`, 404))
        }
    }
    if (typeof (req.body.subcategoryId) !== "undefined") {
        const isSubcategoryExist = await subcategoryModel.findOne({ _id: req.body.subcategoryId, categoryId: reqQuery.categoryId || isProductExist.categoryId })
        if (!isSubcategoryExist) {
            return next(new ErrorClass(`The Subcategory with Id ${req.body.subcategoryId} doesn't exist or doesn't belong to requested category`, 404))
        }
    }
    if (typeof (req.body.brandId) !== "undefined") {
        const isBrandExist = await brandModel.findById(req.body.brandId)
        if (!isBrandExist) {
            return next(new ErrorClass(`The Brand with Id ${req.body.brandId} doesn't exist`, 404))
        }
    }
    //updating the new payment price
    if (req.body.price) {
        req.body.paymentPrice = req.body.price - (req.body.price * ((req.body.discount || 0) / 100))
    }

    //parsing size and colors
    if (req.body.size) req.body.size = JSON.parse(req.body.size)
    if (req.body.color) req.body.color = JSON.parse(req.body.color)

    //uploading new image if there is any
    if (req.files.image?.length) {
        const img = await cloudinary.uploader.upload(req.files.image[0].path, { folder: `${cloudinaryFolder}/product/images` })
        req.body.image = { secure_url: img.secure_url, public_id: img.public_id }
    }

    //uploading new cover images if there is any
    if (req.files.coverImage?.length) {
        const images = []
        for (let file of req.files.coverImage) {
            let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${cloudinaryFolder}/product/coverPhotos` })
            images.push({ secure_url, public_id })
        }
        req.body.coverImage = images
    }


    req.body.QrCode = await qrcode.toDataURL(JSON.stringify({
        name: reqQuery.name || isProductExist.name,
        description: reqQuery.description || isProductExist.description,
        imageURL: reqQuery.image?.secure_url || isProductExist.imageURL,
        Price: reqQuery.paymentPrice || isProductExist.price
    }))


    if (req.body.name) {
        req.body.slug = slugify(req.body.name)
    }

    const beforeUpdateProduct = await productModel.findByIdAndUpdate(productId, req.body)
    if (req.files.image?.length) {
        await cloudinary.uploader.destroy(beforeUpdateProduct.image.public_id)
    }
    if (req.files.coverImage?.length) {
        for (let file of beforeUpdateProduct.coverImage) {
            await cloudinary.uploader.destroy(file.public_id)
        }
    }

    return res.status(200).json({ message: "Done!" })
}

export const deleteProduct = async (req, res, next) => {
    const { productId } = req.params
    const isProductExist = await productModel.findById(productId)
    if (!isProductExist) {
        return next(new ErrorClass("This product doesn't exist!", 404))
    }
    const beforeDeleteProduct = await productModel.findByIdAndDelete(productId)
    if (beforeDeleteProduct.image) {
        await cloudinary.uploader.destroy(beforeDeleteProduct.image.public_id)
    }
    if (beforeDeleteProduct.coverImage?.length) {
        for (let file of beforeDeleteProduct.coverImage) {
            await cloudinary.uploader.destroy(file.public_id)
        }
    }
    return res.status(200).json({ message: "Done!" })
}

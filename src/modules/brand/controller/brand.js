import slugify from "slugify";
import cloudinary from './../../../utils/cloudinary.js';
import brandModel from "../../../../DB/model/Brand.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import { deletingOldFolders } from "../../../utils/deletingOldPhotos.js";
import { movingImages } from "../../../utils/movingImagesCloudinary.js";

export const addBrand = async (req, res, next) => {
    const { name } = req.body
    const createdBy = req.user._id
    const isExist = await brandModel.findOne({ name })
    if (isExist) {
        return next(new ErrorClass("This Brand Already Exists!", 409))
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${cloudinaryFolder}/brand/${name}` })
    const brand = await brandModel.create({ name, slug: slugify(name),createdBy, image: { secure_url, public_id } })
    return res.status(201).json({ message: "Done!", brand: brand })
}

export const updateBrand = async (req, res, next) => {
    const { brandId } = req.params
    req.body.slug = slugify(req.body.name)
    const isExist = await brandModel.findById(brandId)
    if (!isExist) {
        return next(new ErrorClass("Brand You're trying to update Doesn't Exist", 404))
    }
    const isNameExist = await brandModel.findOne({ name: req.body.name, _id: { $ne: brandId } })
    if (isNameExist) {
        return next(new ErrorClass("Another Brand Already exists with this name", 409))
    }

    const oldBrand = await brandModel.findById(brandId)
    if (!req.file && oldBrand.name != req.body.name) {
        //moving folders if the user didnt send an image while updating by moving the image from one folder to another in cloudinary
        req.body.image = await movingImages("brand",'image',oldBrand,req.body.name)
    }
    //updating image if it exists
    if (req.file) {
        const img = await cloudinary.uploader.upload(req.file.path, { folder: `${cloudinaryFolder}/brand/${req.body.name}` })
        req.body.image = { secure_url: img.secure_url, public_id: img.public_id }
    }
    const updatedBrand = await brandModel.findOneAndUpdate({ _id: brandId }, req.body)
    if (req.file) {
        await cloudinary.uploader.destroy(updatedBrand.image.public_id)
        if (updatedBrand.image != null && updatedBrand.name != req.body.name) {
            deletingOldFolders(`${cloudinaryFolder}/brand/${updatedBrand.name}`)
        }
    }
    return res.status(201).json({ message: "Done!" })
}

export const deleteBrand = async (req, res, next) => {
    const { brandId } = req.params
    const isExist = await brandModel.findById(brandId)
    if (!isExist) {
        return next(new ErrorClass("Brand You're trying to delete Doesn't Exist", 404))
    }
    await cloudinary.uploader.destroy(isExist.image.public_id)
    //deleting the folder from cloudinary
    deletingOldFolders(`${cloudinaryFolder}/brand/${isExist.name}`)
    const deletedBrand = await brandModel.deleteOne({ _id: brandId })
    return deletedBrand.deletedCount ? res.status(200).json({ message: "Done!" }) : next(new ErrorClass("something went wrong!", 500))
}

export const findAllBrands = async (req, res, next) => {
    const brands = brandModel.find()
    return res.status(200).json({ brands: brands })
}

export const findBrandByName = async (req, res, next) => {
    const { brandName } = req.params
    const brand = await brandModel.find({ name: brandName })
    return brand.length ? res.status(200).json({ brand: brand }) : next(new ErrorClass("No Brand with that name!", 404))
}
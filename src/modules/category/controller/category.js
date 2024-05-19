import slugify from "slugify";
import cloudinary from './../../../utils/cloudinary.js';
import categoryModel from "../../../../DB/model/Category.model.js";
import { ErrorClass } from "../../../utils/errorClass.js";
import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';
import { deletingOldFolders } from "../../../utils/deletingOldPhotos.js";
import { movingImages } from "../../../utils/movingImagesCloudinary.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";


export const addCategory = async (req, res, next) => {
    const isExist = await categoryModel.findOne({ name: req.body.name })
    const createdBy = req.user._id
    if (isExist) {
        return next(new ErrorClass('name is exist', 409))
    }
    const slug = slugify(req.body.name)
    const img = await cloudinary.uploader.upload(req.file.path, { folder: `${cloudinaryFolder}/category/${req.body.name}` })
    const category = await categoryModel.create({ name: req.body.name, createdBy, slug, image: { secure_url: img.secure_url, public_id: img.public_id } })
    res.status(StatusCodes.CREATED).json({ message: "Done", category, status: ReasonPhrases.CREATED })
}

export const updateCategory = async (req, res, next) => {
    const { categoryId } = req.params
    const isExist = await categoryModel.findOne({ name: req.body.name, _id: { $ne: categoryId } })
    if (isExist) {
        return next(new ErrorClass("the name you want to choose already exists for another category!", 409))
    }
    const oldCategory = await categoryModel.findById(categoryId)
    if (req.file) {
        const img = await cloudinary.uploader.upload(req.file.path, { folder: `${cloudinaryFolder}/category/${req.body.name}` })
        req.body.image = { secure_url: img.secure_url, public_id: img.public_id }
    }
    //this part when i input a different name without including a photo!!!!!
    //here i check if the name changed or not from the original name anyways if it didnt change then theoretically nothing is updated
    if (!req.file && oldCategory.name != req.body.name) {
        req.body.image = await movingImages("category", 'image',oldCategory, req.body.name)
    }
    req.body.slug = slugify(req.body.name)
    const beforeUpdateCategory = await categoryModel.findOneAndUpdate({ _id: categoryId }, req.body)
    if (req.file) {
        await cloudinary.uploader.destroy(beforeUpdateCategory.image.public_id)
        if (beforeUpdateCategory.image != null && beforeUpdateCategory.name != req.body.name) {
            deletingOldFolders(`${cloudinaryFolder}/category/${beforeUpdateCategory.name}`)
        }
    }
    return res.status(200).json({ message: "Done!" })
}

export const findByName = async (req, res, next) => {
    const { searchKey } = req.query

    const categories = await categoryModel.find({
        name: { $regex: `^${searchKey}` }
    })
    if (categories.length == 0) return next(new ErrorClass(`no categories found with that name ${searchKey}`, 404))
    res.status(200).json({ message: "Done!", categories })
}

export const findById = async (req, res, next) => {
    const { categoryId } = req.query
    const categories = await categoryModel.findById(categoryId)
    if (categories.length == 0) return next(new ErrorClass(`no categories found with that id ${categoryId}`, 404))
    res.status(200).json({ message: "Done!", categories })
}

export const findAllCategories = async (req, res, next) => {
    const categories = await categoryModel.find().populate(
        { path: "subcategory" }
    )
    if (categories.length == 0) {
        return next(new ErrorClass("no categories found!", 404))
    }
    res.status(200).json({ message: "Done!", categories })
}

export const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params
    const category = await categoryModel.findByIdAndDelete(categoryId)
    if (!category) {
        return next(new ErrorClass('category not found!', 404))
    }
    await cloudinary.uploader.destroy(category.image.public_id)
    if (category.image != null) {
        deletingOldFolders(`${cloudinaryFolder}/category/${category.name}`)
    }
    const subCat = await subcategoryModel.find({ categoryId: categoryId }).select("_id")
    if (subCat) {
        for (const iterator of subCat) {
            //here i delete the subcategories that are related to this category because a sub category cannot exist without a category
            const url = `${req.protocol}//${req.headers.host}/subcategory/deleteSubCategory/${iterator._id}`;
            await fetch(url, { method: 'DELETE', headers: req.headers });
        }
    }
    return res.status(200).json({ message: "Done!" })
}





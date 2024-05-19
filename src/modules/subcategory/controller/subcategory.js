import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import slugify from "slugify";
import cloudinary from './../../../utils/cloudinary.js';
import categoryModel from "../../../../DB/model/Category.model.js";
import { deletingOldFolders } from "../../../utils/deletingOldPhotos.js";
import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';
import { ErrorClass } from "../../../utils/errorClass.js";
import { movingImages } from "../../../utils/movingImagesCloudinary.js";

export const addSubcategory = async (req, res, next) => {
    const { name, categoryId } = req.body
    const createdBy = req.user._id
    const isExist = await subcategoryModel.findOne({
        name, $or: [{ categoryId: { $ne: req.body.categoryId } },
        { categoryId: req.body.categoryId }]
    })
    //const isExist = await subcategoryModel.findOne({name,categoryId})
    //if name doesnt have to be unique across all categories^^
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new ErrorClass('cannot find category!', 404))
    }
    if (isExist) {
        return next(new ErrorClass('name already exists!', 409))
    }
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${cloudinaryFolder}/subcategory/${name}` })
    const subcategory = await subcategoryModel.create({ name, slug, createdBy, image: { secure_url, public_id }, categoryId: categoryId })
    res.status(StatusCodes.CREATED).json({ message: "Done!", subcategory, status: ReasonPhrases.CREATED })
}

export const updateSubcategory = async (req, res, next) => {
    const { subcategoryId } = req.params
    const isExist = await subcategoryModel.findOne({
        name: req.body.name, _id: { $ne: subcategoryId }, $or: [{ categoryId: { $ne: req.body.categoryId } },
        { categoryId: req.body.categoryId }]
    })
    //if subcategory names have to be unique^^
    //const isExist = await subcategoryModel.findOne({ name: req.body.name, _id: { $ne: subcategoryId }, categoryId: req.body.categoryId }) 
    //if subcategory name can be not unique ^^
    if (req.body.categoryId) {
        const category = await categoryModel.findById(req.body.categoryId)
        if (!category) {
            return next(new ErrorClass("category not found!", 404))
        }
    }
    if (isExist) {
        return next(new ErrorClass("this is name already exists in DB for another subcategory!", 409))
    }

    const oldSub = await subcategoryModel.findById(subcategoryId)
    if (!req.file && oldSub.name != req.body.name) {
        req.body.image = await movingImages("subcategory",'image',oldSub,req.body.name)
    }

    if (req.file) {
        const img = await cloudinary.uploader.upload(req.file.path, { folder: `${cloudinaryFolder}/subcategory/${req.body.name}` })
        req.body.image = { secure_url: img.secure_url, public_id: img.public_id }
    }
    if(req.body.name){
        req.body.slug = slugify(req.body.name)
    }
    const updatedSubcategory = await subcategoryModel.findOneAndUpdate({ _id: subcategoryId }, req.body)
    if (req.file) {
        await cloudinary.uploader.destroy(updatedSubcategory.image.public_id)
        if (updatedSubcategory.image != null && updatedSubcategory.name != req.body.name) {
            deletingOldFolders(`${cloudinaryFolder}/subcategory/${updatedSubcategory.name}`)
        }
    }
    return res.status(200).json({ message: "Done!" })
}

export const deleteSubcategory = async (req, res, next) => {
    const { subcategoryId } = req.params
    const subcategory = await subcategoryModel.findByIdAndDelete(subcategoryId)
    if (!subcategory) {
        return next(new ErrorClass('subcategory not found!', 404))
    }
    await cloudinary.uploader.destroy(subcategory.image.public_id)
    if (subcategory.image != null) {
        deletingOldFolders(`${cloudinaryFolder}/subcategory/${subcategory.name}`)
    }
    return res.status(StatusCodes.OK).json({ messageL: "done" })
}

export const findByName = async (req, res, next) => {
    const { searchKey } = req.query
    const subcategories = await subcategoryModel.find({
        name: { $regex: `^${searchKey}` }
    })
    res.status(200).json({ message: "Done!", subcategories })
}

export const findById = async (req, res, next) => {
    const { subcategoryId } = req.query
    const subcategories = await subcategoryModel.findById(subcategoryId)
    res.status(200).json({ message: "Done!", subcategories })
}

export const findAll = async (req, res, next) => {
    const subcategories = await subcategoryModel.find().populate(
        { path: "categoryId" }
    )
    res.status(200).json({ message: "Done!", subcategories })
}

export const findForCategories = async (req, res, next) => {
    const subcategoriesforthiscategory = await categoryModel.findById(req.params.categoryId).populate(
        { path: "subcategory" }
    )
    res.status(200).json({ message: "Done!", subcategoriesforthiscategory })
}
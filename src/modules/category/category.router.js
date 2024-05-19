import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./category.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"
import auth, { roles } from "../../middleware/auth.js";
const router = Router()

router.use('/:categoryId/subcategories', subcategoryRouter)

router.post('/addCategory',
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addCategoryVal),
    asyncHandler(categoryController.addCategory)
)

router.put('/updateCategory/:categoryId',
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateCategoryVal),
    asyncHandler(categoryController.updateCategory)
)
router.delete('/deleteCategory/:categoryId',
    auth([roles.admin]),
    validation(Val.deleteCategoryVal),
    asyncHandler(categoryController.deleteCategory)
);

router.get('/findByName',
    validation(Val.findByNameVal),
    asyncHandler(categoryController.findByName)
)

router.get('/findById',
    validation(Val.findByIdVal),
    asyncHandler(categoryController.findById)
)

router.get('/',
    asyncHandler(categoryController.findAllCategories)
)


export default router
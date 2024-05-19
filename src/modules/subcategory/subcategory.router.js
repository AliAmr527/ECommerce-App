import { Router } from "express";
import * as subcategoryController from "./controller/subcategory.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import auth, { roles } from "../../middleware/auth.js";
const router = Router({ mergeParams: true })




// router.get('/', (req, res) => {
//     res.status(200).json({ message: "SubCategory Module" })
// })

router.post("/addSubCategory",
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addSubcategoryVal),
    asyncHandler(subcategoryController.addSubcategory)
)

router.put("/updateSubCategory/:subcategoryId",
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateSubcategoryVal),
    asyncHandler(subcategoryController.updateSubcategory)
)

router.delete("/deleteSubCategory/:subcategoryId",
    auth([roles.admin]),
    validation(Val.deleteSubcategoryVal),
    asyncHandler(subcategoryController.deleteSubcategory)
)

router.get("/findByName",
    validation(Val.findByNameVal),
    asyncHandler(subcategoryController.findByName)
)

router.get("/findById",
    validation(Val.findByIdVal),
    asyncHandler(subcategoryController.findById)
)

router.get("/",
    asyncHandler(subcategoryController.findAll)
)

router.get("/FindForCategory",
    asyncHandler(subcategoryController.findForCategories)
)




export default router
import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as brandController from "./controller/brand.js"
import * as Val from "./brand.validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import auth, { roles } from "../../middleware/auth.js";
const router = Router()




// router.get('/', (req ,res)=>{
//     res.status(200).json({message:"Brand Module"})
// })

router.post("/addBrand",
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addBrandVal),
    asyncHandler(brandController.addBrand)
)

router.put("/updateBrand/:brandId",
    auth([roles.admin]),
    fileUpload(fileValidation.image).single('image'),
    validation(Val.updateBrandVal),
    asyncHandler(brandController.updateBrand)
)

router.delete("/deleteBrand/:brandId",
    auth([roles.admin]),
    validation(Val.deleteBrandVal),
    asyncHandler(brandController.deleteBrand)
)

router.get("findAllBrands", asyncHandler(brandController.findAllBrands))

router.get("/findBrandByName/:brandName",
    validation(Val.findBrandByName),
    asyncHandler(brandController.findBrandByName)
)



export default router
import { Router } from "express";
import * as productController from "./controller/product.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./product.validation.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import auth, { roles } from "../../middleware/auth.js";
const router = Router()



router.get('/getProducts',
    validation(Val.getProductsVal),
    asyncHandler(productController.getProducts)
)

router.post('/addProduct',
    auth([roles.admin]),
    fileUpload(fileValidation.image).fields([
        { name: 'image', maxCount: 1 },
        { name: 'coverImage', maxCount: 5 }
    ]),
    validation(Val.addProductVal),
    asyncHandler(productController.addProduct)
)

router.patch("/updateProduct/:productId",
    auth([roles.admin]),
    fileUpload(fileValidation.image).fields([
        { name: 'image', maxCount: 1 },
        { name: 'coverImage', maxCount: 5 }
    ]),
    validation(Val.updateProductVal),
    asyncHandler(productController.updateProduct)
)

router.delete("/deleteProduct/:productId",
    auth([roles.admin]),
    validation(Val.deleteProductVal),
    asyncHandler(productController.deleteProduct)
)


export default router
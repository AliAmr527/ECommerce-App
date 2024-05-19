import { Router } from "express";
import {asyncHandler} from "../../utils/errorHandling.js"
import * as authController from "./controller/registration.js"
import { validation } from "../../middleware/validation.js";
import * as Val from "./auth.validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router()


router.post("/signUp",
    fileUpload(fileValidation.image).single("image"),
    validation(Val.signUpVal),
    asyncHandler(authController.signUp)
)

router.patch("/confirmEmail",
    validation(Val.confirmEmailVal),
    asyncHandler(authController.confirmEmail)
)

router.post("/signIn",
    validation(Val.signInVal),
    asyncHandler(authController.signIn)
)

router.put("/sendCode",
    validation(Val.sendCodeVal),
    asyncHandler(authController.sendCode)
)

router.put("/resetPassword",
    validation(Val.resetPasswordVal),
    asyncHandler(authController.resetPassword)
)


export default router
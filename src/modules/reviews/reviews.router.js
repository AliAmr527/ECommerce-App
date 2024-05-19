import { Router } from "express";
import * as reviewController from "./controller/reviews.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./reviews.validation.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import auth, { roles } from "../../middleware/auth.js";
const router = Router()




router.get('/:id', 
    reviewController.getReviewsPerUser
)

router.post('/addReview',
    auth([roles.admin,roles.user]),
    validation(Val.addReviewVal),
    asyncHandler(reviewController.addReview)
)

router.put('/updateReview/:id',
    auth([roles.admin,roles.user]),
    validation(Val.updateReviewVal),
    asyncHandler(reviewController.updateReview)
)

router.delete('/deleteeReview/:id',
    auth([roles.admin,roles.user]),
    validation(Val.deleteReviewVal),
    asyncHandler(reviewController.deleteReview)
)




export default router
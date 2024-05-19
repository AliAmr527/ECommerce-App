import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as Val from "./coupon.validation.js"
import auth, { roles } from "../../middleware/auth.js";
import * as couponController from "./controller/coupon.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()




router.post('/addCoupon', 
    auth([roles.admin]),
    validation(Val.addCouponVal),
    asyncHandler(couponController.addCoupon)
)

router.get('/getCoupons',
    asyncHandler(couponController.getCoupons)
)

router.delete('/deleteCoupon/:id',
    validation(Val.deleteCouponVal),
    asyncHandler(couponController.deleteCoupon)
)



export default router
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as Val from "./cart.validation.js"
import auth, { roles } from "../../middleware/auth.js";
import * as cartController from "./controller/cart.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()




router.post('/addToCart',
    auth([roles.user, roles.admin]),
    validation(Val.addToCartVal),
    asyncHandler(cartController.addToCart)
)

router.get('/getCart',
    auth([roles.user, roles.admin]),
    validation(Val.getCartVal),
    asyncHandler(cartController.getCart)
)




export default router
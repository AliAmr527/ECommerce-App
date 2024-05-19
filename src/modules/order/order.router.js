import express, { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as Val from "./order.validation.js"
import auth, { roles } from "../../middleware/auth.js";
import * as orderController from "./controller/order.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()




router.post('/createOrder',
    auth([roles.admin, roles.user]),
    validation(Val.createOrderVal),
    asyncHandler(orderController.createOrder)
)

router.post('/webhook', express.raw({ type: 'application/json' }),
    asyncHandler(orderController.webhook)
)

router.get('/successUrl',
    orderController.successUrl
)
router.put('/cancelOrder/:id',
    auth([roles.admin, roles.user]),
    validation(Val.cancelOrderVal),
    asyncHandler(orderController.cancelOrder)
)

router.get('/getMyOrders',
    auth([roles.admin, roles.user]),
    validation(Val.getMyOrdersVal),
    asyncHandler(orderController.getMyOrders)
)



export default router
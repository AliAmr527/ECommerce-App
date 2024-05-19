import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as Val from './user.validation.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as userController from "./controller/user.js"
import auth, { roles } from "../../middleware/auth.js";
const router = Router()




router.get('/forCategories',
    auth([roles.admin, roles.user]),
    validation(Val.findUserInfoVal),
    asyncHandler(userController.findUserWithInfo)
)

router.patch('/addToFavorites',
    auth([roles.admin, roles.user]),
    validation(Val.addToFavoritesVal),
    asyncHandler(userController.addToFavorites)
)

router.get('/getFavorites',
    auth([roles.admin, roles.user]),
    validation(Val.getFavoritesVal),
    asyncHandler(userController.getFavorites)
)




export default router
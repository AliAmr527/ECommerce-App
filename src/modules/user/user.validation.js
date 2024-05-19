import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const findUserInfoVal = {
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const addToFavoritesVal = {
    body:joi.object().required().keys({
        productId:generalFields.id
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const getFavoritesVal = {
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}
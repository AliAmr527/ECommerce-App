import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addToCartVal = {
    body:joi.object().required().keys({
        productId:generalFields.id,
        quantity:joi.number().max(99).min(1)
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const getCartVal = {
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}
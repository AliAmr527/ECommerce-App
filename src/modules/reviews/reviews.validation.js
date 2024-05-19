import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const addReviewVal = {
    body:joi.object({}).required().keys({
        rating:joi.number().min(0).max(10),
        productId:generalFields.id,
        comment:joi.string().max(500)
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const updateReviewVal = {
    body:joi.object({}).required().keys({
        rating:joi.number().min(0).max(10),
        reviewId:generalFields.id,
        comment:joi.string().max(500)
    }),
    params:joi.object({}).required().keys({
        id:generalFields.id
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const deleteReviewVal = {
    body:joi.object({}).required().keys({
        reviewId:generalFields.id,
    }),
    params:joi.object({}).required().keys({
        id:generalFields.id
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}
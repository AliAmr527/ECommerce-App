import coreJoi from "joi"
import joiDate from "@joi/date";
const joi = coreJoi.extend(joiDate) //to be able to control the date format
import { generalFields } from "../../middleware/validation.js";

export const createOrderVal = {
    body:joi.object().required().keys({
        products:joi.array().items({
            productId:generalFields.id,
            quantity:joi.number()
        }),
        address:joi.string().required(),
        phone:joi.string().regex(/^[0-9]{11}$/).required(),
        coupon:joi.string().min(2).max(20),
        orderPaymentMethod:joi.string().valid('cash', 'card').required()
    }), 
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const cancelOrderVal = {
    body:joi.object().required().keys({
        reason:joi.string().min(20).max(500)
    }),
    params:joi.object().required().keys({
        id:generalFields.id
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const getMyOrdersVal = {
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}
import coreJoi from "joi"
import joiDate from "@joi/date";
const joi = coreJoi.extend(joiDate) //to be able to control the date format
import { generalFields } from "../../middleware/validation.js";

export const addCouponVal = {
    body:joi.object().required().keys({
        code:joi.string().max(20),
        amountOfDiscount:joi.number().positive().max(100),
        noOfUses:joi.number().positive(),
        expiryDate:joi.date().min(Date.now())
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const deleteCouponVal ={
    params:joi.object().required().keys({
        id:generalFields.id
    })
}
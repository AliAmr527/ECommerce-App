import coreJoi from "joi"
import joiDate from "@joi/date";
const joi = coreJoi.extend(joiDate)
import { generalFields } from "../../middleware/validation.js"

export const signUpVal = {
    body:joi.object().required().keys({
        userName:generalFields.name,
        email:generalFields.email,
        password:generalFields.password,
        phone:joi.string().regex(/^[0-9]{11}$/),
        DoB:joi.date().format("YYYY-MM-DD")
    }),
    file:generalFields.file.required()
}

export const confirmEmailVal = {
    body:joi.object().required().keys({
        email:generalFields.email,
        code:joi.string().length(6)
    })
}

export const signInVal = {
    body:joi.object().required().keys({
        email:generalFields.email,
        password:generalFields.password
    })
}

export const sendCodeVal = {
    body:joi.object().required().keys({
        email:generalFields.email,
    })
}

export const resetPasswordVal = {
    body:joi.object().required().keys({
        email:generalFields.email,
        password:generalFields.password,
        code:joi.string().length(6)
    })
}
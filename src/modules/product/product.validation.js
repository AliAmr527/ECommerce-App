import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const addProductVal = {
    body:joi.object().keys({
        name:generalFields.name.required().min(2).max(100),
        description:joi.string().min(50).max(500).required(),
        stock:joi.number().min(0).positive().required(),
        price:joi.number().required().min(0).positive(),
        discount:joi.number().positive().max(100),
        categoryId:generalFields.id.required(),
        subcategoryId:generalFields.id.required(),
        brandId:generalFields.id.required(),
        //color:joi.array().items(joi.string().valid('red','blue','orange','green')),
        color:joi.custom((value,helper)=>{
            value = JSON.parse(value)
            const valueSchema = joi.object({
                value:joi.array().items(joi.string().valid('red','blue','orange','green'))
            })
            const validationResult = valueSchema.validate({value})
            if(validationResult.error){
                helper.message(validationResult.error.details)
            }else{
                return true
            }
        }),
        size:joi.custom((value,helper)=>{
            value = JSON.parse(value)
            const valueSchema = joi.object({
                value:joi.array().items(joi.string())
            })
            const validationResult = valueSchema.validate({value})
            if(validationResult.error){
                helper.message(validationResult.error.details)
            }else{
                return true
            }
        })
    }),
    files:joi.object().required().keys({
        image:joi.array().items(generalFields.file).length(1).required(),
        coverImage:joi.array().items(generalFields.file).max(5)
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const updateProductVal = {
    body:joi.object().keys({
        name:generalFields.name.min(2).max(100),
        description:joi.string().min(50).max(500),
        stock:joi.number().min(0).positive(),
        price:joi.number().min(0),
        discount:joi.number().positive().max(100),
        categoryId:generalFields.id,
        subcategoryId:generalFields.id,
        brandId:generalFields.id,
        //color:joi.array().items(joi.string().valid('red','blue','orange','green')),
        color:joi.custom((value,helper)=>{
            value = JSON.parse(value)
            const valueSchema = joi.object({
                value:joi.array().items(joi.string().valid('red','blue','orange','green'))
            })
            const validationResult = valueSchema.validate({value})
            if(validationResult.error){
                helper.message(validationResult.error.details)
            }else{
                return true
            }
        }),
        size:joi.custom((value,helper)=>{
            value = JSON.parse(value)
            const valueSchema = joi.object({
                value:joi.array().items(joi.string())
            })
            const validationResult = valueSchema.validate({value})
            if(validationResult.error){
                helper.message(validationResult.error.details)
            }else{
                return true
            }
        })
    }),
    files:joi.object().keys({
        image:joi.array().items(generalFields.file).length(1).required(),
        coverImage:joi.array().items(generalFields.file).max(5)
    }),
    params:joi.object().keys({
        productId:generalFields.id.required()
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const getProductsVal = {
    query:joi.object().keys({
        size:joi.number(),
        page:joi.number(),
        fields:joi.string()
    }).options({ allowUnknown: true })
}

export const deleteProductVal = {
    params:joi.object().required().keys({
        productId:generalFields.id
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

// export const BrandVal ={
//     body: joi.object().required().keys({}),
//     file: generalFields.file.required(),
//     params: joi.object().required().keys({}),
//     query: joi.object().required().keys({})
// }

export const addBrandVal ={
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file.required(),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const updateBrandVal ={
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        brandId:generalFields.id
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const deleteBrandVal = {
    params:joi.object().required().keys({
        brandId:generalFields.id
    }),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const findBrandByName = {
    params:joi.object().required().keys({
        brandName:generalFields.name
    })
}
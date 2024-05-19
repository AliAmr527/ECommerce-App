import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addSubcategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
        categoryId:generalFields.id
    }),
    file: generalFields.file.required(),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({}),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const updateSubcategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
        categoryId:generalFields.id
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        subcategoryId:generalFields.id
    }),
    query: joi.object().required().keys({}),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const deleteSubcategoryVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        subcategoryId: generalFields.id
    }),
    query: joi.object().required().keys({}),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}

export const findByNameVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
    }),
    query: joi.object().required().keys({
        searchKey:generalFields.name
    })
}

export const findByIdVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
    }),
    query: joi.object().required().keys({
        subcategoryId:generalFields.id
    })
}
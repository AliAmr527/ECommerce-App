import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addCategoryVal = {
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
export const updateCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({}),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}
export const deleteCategoryVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({}),
    headers:joi.object().required().keys({
        authorization:generalFields.token 
    }).options({allowUnknown:true})
}
export const findByNameVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({
        searchKey:generalFields.name
    })
}

export const findByIdVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({
        categoryId:generalFields.id
    })
}



// export const findAllSubcategoriesUnderSpecificCategoryVal = {
//     body: joi.object().required().keys({}),
//     params: joi.object().required().keys({
//         categoryId:generalFields.id
//     }),
//     query: joi.object().required().keys({})
// }
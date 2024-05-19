import cloudinary from "./cloudinary.js"
import { asyncHandler } from "./errorHandling.js"

//this file is for making the problem of deleting old data cloudinary folder modular
export const deletingOldFolders =  async (path) => {
    try {
        await cloudinary.api.delete_resources_by_prefix(`${path}`)
        await cloudinary.api.delete_folder(`${path}`)
    } catch (error) {
        return error
    }
}
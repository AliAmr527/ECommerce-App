import cloudinary from "./cloudinary.js"
import { deletingOldFolders } from "./deletingOldPhotos.js"

export const movingImages = async (modelName,nameOfImage,oldModel,newModelName)=>{
        //the old public id with the old name in it
        console.log(oldModel.image.public_id.toString())
        //here i change the existing photo's public id part that has the old name in it with the new name effectively "moving it from one folder to another
        const newPublicIdName = oldModel.image.public_id.toString().replace(`${oldModel.name}`, `${newModelName}`)
        //here you can check this happening real time
        console.log(newPublicIdName)
        //here i change the public id in cloudinary
        await cloudinary.uploader.rename(oldModel.image.public_id.toString(), newPublicIdName.toString())
        //this is a function i created deleting the old folders
        deletingOldFolders(`${cloudinaryFolder}/${modelName}/${oldModel.name}`)
        //here i am taking the new secure url and public id after "moving" the image from folder to folder to update it in database to access photo from there directly
        const img = await cloudinary.api.resource(newPublicIdName.toString())
        return { secure_url: img.secure_url, public_id: img.public_id }
        //sick, no?
}
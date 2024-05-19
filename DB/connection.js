import mongoose from 'mongoose'
const connectDB  = async ()=>{
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_LOCAL)
    .then(res=>console.log(`DB Connected successfully`))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}


export default connectDB;
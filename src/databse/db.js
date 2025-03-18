import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const mongoURL=process.env.MONGO_URI
const connectDB=async()=>{
    if(mongoose.connection.readyState===1){
        return;
    }
    await mongoose.connect(mongoURL);
}
export default connectDB
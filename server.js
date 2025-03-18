import meta from './src/mongoose.js';
import upload from './src/storage.js';
import file from './src/fileHandle.js';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors({
    origin:"*"
}));
app.get("/",(req,res)=>{
    res.json({message : "hello from server.js"});
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/upload',upload);
app.use("/file",file);
app.use("/meta",meta);
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`The Server is running on PORT ${port}`))


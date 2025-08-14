import express from 'express';
import drive from './ConfigDrive';


const router = express.Router();
router.get("/",(req,res)=>{
    res.json({message : "hello from fileHandle.js"});
});

router.get("/download/:user/:filename",(req,res)=>{
    res.download(`./DataBase/${req
        .params
        .user}/${req
        .params.filename}`);
});
router.get('/view/:user/:filename', (req, res) => {
    const fileName = req.params.filename;
    const user = req.params.user;
    const filePath = 
    console.log('File path:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found');
        }
    });
});


export default router;

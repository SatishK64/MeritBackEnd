import express from 'express';
import connectDB from './databse/db.js';
import User from './schema/users.js';


const router = express.Router();
connectDB();
router.put('/upload', async (req, res) => {
    console.log(req.body);
    const { username, file } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        console.log("User not found in database");
        return res.status(404).json({ message: "User not found" });
    }

    if (!file || !file.fileName || !file.previewImage||!file.title) {
        return res.status(400).json({ message: "File name or preview image not found" });
    }

    let fileExists = user.files.some(f => f.fileName === file.fileName);
    if (fileExists) {
        return res.status(409).json({ message: "File already exists" });
    }

    if (file.tags) {
        file.tags.forEach(tag => {
            if (!user.tags.includes(tag)) {
                user.tags.push(tag);
            }
        });
    }

    user.files.push({
        fileName: file.fileName,
        previewImage: file.previewImage,
        tags: file.tags || [],
        title:file.title
    });

    await user.save();
    res.status(200).json({ message: "User file details updated" });

});

export default router;
import express from 'express';
import multer from 'multer';
import path from 'path';
import convertFirstPageToPng from './convert.js';
import axios from 'axios'; // Add this import
import connectDB from './databse/db.js';
import User from './schema/users.js';
import drive ,{ Upload } from './ConfigDrive.js';

connectDB();
const router = express.Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, '../DataBase', req.params.user);
    
//     // Create the uploads directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
    
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Keep the original filename
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
//     cb(null, filename);
//   }
// });

const buffer = multer.memoryStorage();


// Set up multer with file size limits and allowed types
const uploadbuffer = multer({
  storage:buffer,
  limits:{
    fileSize: 25 * 1024 * 1024 //25MB limit
  },
  fileFilter(req, file, cb) {
    // Allow only PDF or image files
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or image files are allowed!"), false);
    }
  }
});
// const uploadDisk = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 25 * 1024 * 1024 // 25MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     // You can implement file type restrictions here if needed
//     cb(null, true);
//   }
// });

// File upload endpoint
router.post('/:user', uploadbuffer.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const username = req.params.username;
  const user=await User.findOne({username});

  // console.log('File uploaded:', req.file.originalname, title, req.file.size, req.file.mimetype);
  try {
    // Extract title and tags from the request body
    const title = req.body.title || '';
    const tags = req.body.tags ? req.body.tags.split(',') : [];
    const uploadResponse = await Upload(req.file.buffer,req.file.mimetype,req.file.originalname);
    const fileId=uploadResponse.id;
  
    // Check if the uploaded file is a PDF
    if (req.file.mimetype === 'application/pdf' || path.extname(req.file.originalname).toLowerCase() === '.pdf') {
      console.log('PDF file detected, converting first page to PNG...');
      // Convert the first page to PNG (this will store the PNG in the same directory)
      const pngResponse = await convertFirstPageToPng(req.file.buffer,req.file.originalname);
      const pngId=pngResponse.id;
      
      console.log(fileId, pngId, title, tags);
      
      try {
        // Update metadata in the database
        const response = await axios.put('http://localhost:3000/meta/upload', {
          username: req.params.user,
          file: {
            fileName: fileId,
            previewImage: pngId,
            title: title,
            tags: tags
          }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Metadata update response:', response.data);
        
        return res.status(200).json({ 
          message: 'File uploaded and converted successfully',
          pdf: {
            name: req.file.originalname,
            filename: uploadResponse,
            size: req.file.size,
            mimetype: req.file.mimetype
          },
          png: {
            name: uploadResponse
          },
          metadata: {
            title: title,
            tags: tags
          }
        });
      } catch (metaError) {
        console.error('Error updating metadata:', metaError.message);
        // If metadata update fails, should we delete the uploaded file?
        return res.status(500).json({ 
          error: 'Error updating metadata', 
          message: metaError.message 
        });
      }
    }
    
    // For non-PDF files
    console.log(req.file.filename, title, tags, req.params.user);
    
    try {
      const uploadResponse = await Upload(req.file.buffer,req.file.mimetype,req.file.originalname);
      const fileId=uploadResponse.id;
      // Update metadata in the database
      const response = await axios.put('http://localhost:3000/meta/upload', {
        username: req.params.user,
        file: {
          fileName: fileId,
          previewImage: fileId,
          title: title,
          tags: tags
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Metadata update response:', response.data);
      
      return res.status(200).json({ 
        message: 'File uploaded successfully',
        file: {
          name: req.file.originalname,
          filename: fileId,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        metadata: {
          title: title,
          tags: tags
        }
      });
    } catch (metaError) {
      console.error('Error updating metadata:', metaError.message);
      return res.status(500).json({ 
        error: 'Error updating metadata', 
        message: metaError.message 
      });
    }
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ 
      error: 'Error processing file', 
      message: error.message 
    });
  }
});

export default router;
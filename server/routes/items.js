const express = require('express')
const router = express.Router()
const ITEM = require('../models/items')
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage: storage })
// Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null,  path.join(__dirname, '../../public/img/items')); // ✅ Direct absolute path
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null,uniqueSuffix  + '-' + file.originalname)
//   }
// })

// const storage = multer.memoryStorage(); Store files in memory


// Route to create a new item
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const { name, price, rating, category } = req.body;
        const imageUrl = req.file.path; // ✅ Cloudinary URL
        // const photopath = req.file ? req.file.path : null //This used for storing file path in data base but not using here because we are directly storing the buffer or base64 data of file(photo) in database

        // const photoBase64 = req.file ? req.file.buffer.toString('base64') : null; // Convert file buffer to Base64 string //We are also not using this method instead we will be using cloud service from cloudinary

        //create item record with Base64-encoded image
        const newItem = new ITEM({
            name,
            price,
            rating,
            photo: imageUrl,
            category,
            quantity
            
        });
        await newItem.save();
        res.status(201).json({ message: 'Item created successfully', item: newItem });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error in creating new item', });

    }
});

router.get('/', (req, res) => {
    res.send('Items Page');
})


module.exports = router;
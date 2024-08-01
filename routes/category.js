const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { uploadCategory } = require('../uploadFile');
const multer = require('multer');
const Category = require('../model/category');

// Get all Categories
router.get('/', asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ status: true, message: "Categories retrieved successfully.", data: categories });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));




// Get a Category by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categories = await Category.findById(categoryId);
        if (!categories) {
            return res.status(404).json({ status: false, message: "Category not found." });
        }
        res.json({ status: true, message: "Category retrieved successfully.", data: categories });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

// Create a new category with image upload
router.post('/', asyncHandler(async (req, res) => {
    try {
        uploadCategory.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Add category: ${err}`);
                return res.json({ status: false, message: err });
            } else if (err) {
                console.log(`Add category: ${err}`);
                return res.json({ status: false, message: err });
            }
            const { name } = req.body;
            let imageUrl = 'no_url';
            if (req.file) {
                imageUrl = `http://localhost:3000/image/category/${req.file.filename}`;
            }
            console.log('url ', req.file)

            if (!name) {
                return res.status(400).json({ status: false, message: "Name is required." });
            }

            try {
                const newCategory = new Category({
                    name: name,
                    image: imageUrl

                });
                await newCategory.save();
                res.json({ status: true, message: "Category created successfully.", data: null });
            } catch (error) {
                console.error("Error creating category:", error);
                res.status(500).json({ status: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error creating category: ${err.message}`);
        return res.status(500).json({ status: false, message: err.message });
    }
}));
//  Update a category
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;
        uploadCategory.single('img')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB.';
                }
                console.log(`Update category: ${err.message}`);
                return res.json({ status: false, message: err.message });
            } else if (err) {
                console.log(`Update category: ${err.message}`);
                return res.json({ status: false, message: err.message });
            }

            const { name } = req.body;
            let image = req.body.image;

            if (req.file) {
                image = `http://localhost:3000/image/category/${req.file.filename}`;
            }

            if (!name || !image) {
                return res.status(400).json({ status: false, message: "Name and image are required." });
            }

            try {
                const updatedCategory = await Category.findByIdAndUpdate(categoryID, { name: name, image: image }, { new: true });
                if (!updatedCategory) {
                    return res.status(404).json({ status: false, message: "Category not found." });
                }
                res.json({ status: true, message: "Category updated successfully.", data: null });
            } catch (error) {
                res.status(500).json({ status: false, message: error.message });
            }

        });

    } catch (err) {
        console.log(`Error updating Category: ${err.message}`);
        return res.status(500).json({ status: false, message: err.message });
    }
}));


module.exports = router;
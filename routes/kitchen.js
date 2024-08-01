const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const User = require('../model/kitchen');
const Kitchen = require('../model/kitchen');
const { uploadKitchen } = require('../uploadFile');
const multer = require('multer');

// Get all Kitchens
router.get('/', asyncHandler(async (req, res) => {
    try {
        const kitchens = await Kitchen.find();
        res.json({ status: true, message: "Kitchens retrieved successfully.", data: kitchens });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));




// Get a Kitchen by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const kitchenId = req.params.id;
        const user = await Kitchen.findById(kitchenId);
        if (!user) {
            return res.status(404).json({ status: false, message: "Kitchen not found." });
        }
        res.json({ status: true, message: "Kitchen retrieved successfully.", data: user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

// Create a new Kitchen with image upload
// router.post('/', asyncHandler(async (req, res) => {
//     try {
//         uploadKitchen.single('img')(req, res, async function (err) {
//             if (err instanceof multer.MulterError) {
//                 if (err.code === 'LIMIT_FILE_SIZE') {
//                     err.message = 'File size is too large. Maximum filesize is 5MB.';
//                 }
//                 console.log(`Add kitchen: ${err}`);
//                 return res.json({ status: false, message: err });
//             } else if (err) {
//                 console.log(`Add kitchen: ${err}`);
//                 return res.json({ status: false, message: err });
//             }
//             const { name,desc,location } = req.body;
//             let imageUrl = 'no_url';
//             if (req.file) {
//                 imageUrl = `http://localhost:3000/image/kitchen/${req.file.filename}`;
//             }
//             console.log('url ', req.file)

//             if (!name) {
//                 return res.status(400).json({ status: false, message: "Name is required." });
//             }

//             try {
//                 const newKitchen = new Kitchen({
//                     name: name,
//                     desc:desc,
//                     location:location,
//                     image: imageUrl
//                 });
//                 await newKitchen.save();
//                 res.json({ status: true, message: "Kitchen created successfully.", data: null });
//             } catch (error) {
//                 console.error("Error creating kitchen:", error);
//                 res.status(500).json({ status: false, message: error.message });
//             }

//         });

//     } catch (err) {
//         console.log(`Error creating kitchen: ${err.message}`);
//         return res.status(500).json({ status: false, message: err.message });
//     }
// }));

router.post('/', asyncHandler(async (req, res) => {
  try {
    uploadKitchen.array('images', 10)(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          err.message = 'File size is too large. Maximum filesize is 5MB.';
        }
        console.log(`Add kitchen: ${err}`);
        return res.json({ status: false, message: err });
      } else if (err) {
        console.log(`Add kitchen: ${err}`);
        return res.json({ status: false, message: err });
      }

      const { name, desc, location,rating,totalRatings } = req.body;

      if (!name) {
        return res.status(400).json({ status: false, message: "Name is required." });
      }

      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => `http://localhost:3000/image/kitchen/${file.filename}`);
      }

      try {
        const newKitchen = new Kitchen({
          name: name,
          desc: desc,
          location: location,
          rating:rating||0,
          totalRatings:totalRatings||0,
          image: imageUrls.length > 0 ? imageUrls[0] : 'no_url', // Use the first image as main image if available
          images: imageUrls
        });
        await newKitchen.save();
        res.json({ status: true, message: "Kitchen created successfully.", data: newKitchen });
      } catch (error) {
        console.error("Error creating kitchen:", error);
        res.status(500).json({ status: false, message: error.message });
      }
    });
  } catch (err) {
    console.log(`Error creating kitchen: ${err.message}`);
    return res.status(500).json({ status: false, message: err.message });
  }
}));

//update Kitchen by id

router.put('/:id', asyncHandler(async (req, res) => {
  try {
    const kitchenID = req.params.id;
    uploadKitchen.array('images', 10)(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          err.message = 'File size is too large. Maximum filesize is 5MB.';
        }
        console.log(`Update kitchen: ${err.message}`);
        return res.json({ status: false, message: err.message });
      } else if (err) {
        console.log(`Update kitchen: ${err.message}`);
        return res.json({ status: false, message: err.message });
      }

      const { name, desc, location,rating,totalRatings  } = req.body;

      if (!name) {
        return res.status(400).json({ status: false, message: "Name is required." });
      }


      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => `http://localhost:3000/image/kitchen/${file.filename}`);
      }

      let updateData = { name, desc, location,rating,totalRatings };
      if (imageUrls.length > 0) {
        updateData.image = imageUrls[0]; // Use the first image as main image if available
        updateData.images = imageUrls;
      }

      try {
        const updatedKitchen = await Kitchen.findByIdAndUpdate(kitchenID, updateData, { new: true });
        if (!updatedKitchen) {
          return res.status(404).json({ status: false, message: "Kitchen not found." });
        }
        res.json({ status: true, message: "Kitchen updated successfully.", data: updatedKitchen });
      } catch (error) {
        res.status(500).json({ status: false, message: error.message });
      }

    });
  } catch (err) {
    console.log(`Error updating kitchen: ${err.message}`);
    return res.status(500).json({ status: false, message: err.message });
  }
}));

// Delete a Kitchen
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const kitchenId = req.params.id;
        const deletedUser = await Kitchen.findByIdAndDelete(kitchenId);
        if (!deletedUser) {
            return res.status(404).json({ status: false, message: "Kitchen not found." });
        }
        res.json({ status: true, message: "Kitchen deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}));

module.exports = router;

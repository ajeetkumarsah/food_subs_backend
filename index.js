const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
//?Middle wair
app.use(cors({ origin: '*' }))
app.use(bodyParser.json());
//? setting static folder path
app.use('/image/products', express.static('public/products'));
app.use('/image/category', express.static('public/category'));
app.use('/image/poster', express.static('public/posters'));

const URL = process.env.MONGO_URL;
mongoose.connect(URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
app.use('/kitchens', require('./routes/kitchen'));
// app.use('/variantTypes', require('./routes/variantType'));
// app.use('/variants', require('./routes/variant'));
// app.use('/products', require('./routes/product'));
// app.use('/couponCodes', require('./routes/couponCode'));
// app.use('/posters', require('./routes/poster'));
app.use('/users', require('./routes/user'));
// app.use('/orders', require('./routes/order'));
// app.use('/payment', require('./routes/payment'));
// app.use('/notification', require('./routes/notification'));


// Example route using asyncHandler directly in app.js
app.get('/', asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'API working successfully', data: null });
}));

// Global error handler
app.use((error, req, res, next) => {
    res.status(500).json({ success: false, message: error.message, data: null });
});


app.listen(process.env.PORT||3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});




// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());


// mongoose.connect('mongodb+srv://ajeetkumarsah:ycf9UlIlLmYsMWDb@foodsubscription.fyrcvdn.mongodb.net/?retryWrites=true&w=majority&appName=FoodSubscription');
// const db = mongoose.connection;
// db.on('error', (error) => console.error(error));
// db.once('open', () => console.log('Connected to Database'));


// app.delete('/:id', async (req, res) => {
//   const id = req.params.id;
//  await User.findByIdAndDelete(id);
//   res.json('Delete successfully');
// });


// app.post('/',(req,res) => {
//   const {name,age,email,profile}=req.body;
//   const newUser = new User({ name: name, age: age, email: email,profile:profile });
// newUser.save();
// res.json({"status":true,"data":"User created successfully"});
// });

// app.get('/',async (req,res) => {
//   const users =  await User.find();
// res.json({"status":true,"data":users});
// });
// app.put('/:id',async (req,res) => {
//   const id=req.params.id;
//   const {name,age,email,profile}=req.body;
//     await User.findByIdAndUpdate(id,{$set:{name:name,email:email,age:age}},{new:true});
// res.json({"status":true,"data":"Updated Successfully."});
// });

// app.listen(port, () => {
//   console.log(`Server is running on :${port}`);
// });



// const { Schema, model } = mongoose;
// const userSchema = new Schema({
//   name: String,
//   age: Number,
//   email: String,
//   profile:String
// });
// const User = model('Users', userSchema);
const mongoose = require('mongoose');

const kitchenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  location: {
    type: String
  },
  rating: {
    type: Number
  },
  totalRatings: {
    type: String
  },
  images: [{
    type: String
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Kitchen = mongoose.model('kitchen', kitchenSchema);

module.exports = Kitchen;

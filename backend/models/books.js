const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    year: { type: Number },
    genre: { type: String },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    ratings: [{ userId: String, grade: Number }],
    averageRating: { type: Number, default: 0 },
  });
  


module.exports = mongoose.model('Book', bookSchema);



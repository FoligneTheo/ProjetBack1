const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");
const bookController = require("../controllers/bookController");
const mongoose = require("mongoose");
const router = express.Router();
const upload = require("../middlewares/multer");


router.post("/", auth, upload.single("image"), bookController.addBook);
router.get("/", bookController.getAllBooks);
router.get("/best-rated", bookController.getBestRatedBooks);
router.post("/:id/rating", auth, bookController.rateBook);
router.put("/:id", auth, upload.single("image"), bookController.updateBook);
router.delete("/:id", auth, bookController.deleteBook);
router.get("/:id", bookController.getBookById);

module.exports = router;



// userId: '67b62637922bffb62dc0e6f4',
// title: 'dyth',
// author: 'dtgrhuy',
// year: 'dyj',
// genre: 'dyj',
// ratings: [ { userId: '67b62637922bffb62dc0e6f4', grade: 0 } ],
// averageRating: 0

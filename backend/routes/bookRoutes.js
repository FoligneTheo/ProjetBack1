const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");
const bookController = require("../controllers/bookController");
const mongoose = require("mongoose");
const router = express.Router();
const upload = require("../middlewares/multer");
const convertToWebp = require("../middlewares/convertToWebp");

router.post("/", auth, upload.single("image"), convertToWebp, bookController.addBook);
router.get("/", bookController.getAllBooks);
router.get("/best-rated", bookController.getBestRatedBooks);
router.post("/:id/rating", auth, bookController.rateBook);
router.put("/:id", auth, upload.single("image"), convertToWebp, bookController.updateBook);
router.delete("/:id", auth, bookController.deleteBook);
router.get("/:id", bookController.getBookById);

module.exports = router;

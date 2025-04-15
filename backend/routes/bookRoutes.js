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
router.get("/:id", async (req, res) => {
    console.log("📡 Requête reçue avec l'ID :", req.params.id);

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log("❌ Livre non trouvé en base !");
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        console.log("📚 Livre trouvé :", book);
        res.status(200).json(book);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du livre :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});

module.exports = router;



// userId: '67b62637922bffb62dc0e6f4',
// title: 'dyth',
// author: 'dtgrhuy',
// year: 'dyj',
// genre: 'dyj',
// ratings: [ { userId: '67b62637922bffb62dc0e6f4', grade: 0 } ],
// averageRating: 0

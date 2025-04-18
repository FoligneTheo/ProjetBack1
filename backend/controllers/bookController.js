const Book = require("../models/books");

// Ajouter un livre
exports.addBook = async (req, res) => {
    try {
        console.log(" Requête reçue pour ajouter un livre !");
        console.log(" Fichier image reçu :", req.file);  // Vérifier l'image
        console.log(" Données reçues :", req.body);  // Vérifier les données reçues

        const bookData = JSON.parse(req.body.book);
        console.log("🎯 Données après parsing :", bookData);

        if (!bookData.title || !bookData.userId) {
            console.error(" Erreur : Titre et utilisateur obligatoires !");
            return res.status(400).json({ message: "Titre et utilisateur obligatoires" });
        }

        let rating = bookData.ratings?.[0]?.grade ? parseInt(bookData.ratings[0].grade, 10) : 0;

        if (isNaN(rating) || rating < 0 || rating > 5) { 
            console.error(" Erreur : Note invalide !");
            return res.status(400).json({ message: "Note entre 0 et 5 requise." });
        }

        const newBook = new Book({
            ...bookData,
            ratings: [{ userId: bookData.userId, grade: rating }],
            imageUrl: req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "",

        });

        console.log(" Livre en cours d'ajout :", newBook);

        // Calcul de la moyenne des notes
        const totalRating = newBook.ratings.reduce((sum, r) => sum + r.grade, 0);
        newBook.averageRating = totalRating / newBook.ratings.length;

        await newBook.save();

// Mise à jour immédiate de averageRating
const updatedBook = await Book.findByIdAndUpdate(
    newBook._id,
    { averageRating: newBook.ratings.reduce((sum, r) => sum + r.grade, 0) / newBook.ratings.length },
    { new: true }
);

        
        console.log(" Livre ajouté avec succès :", newBook);
        res.status(201).json({ message: "Livre ajouté avec succès", book: newBook });

    } catch (error) {
        console.error(" Erreur interne du serveur :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
};


// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Noter un livre
exports.rateBook = async (req, res) => {
    try {
        console.log(" Note reçue :", req.body);
        console.log(" ID du livre :", req.params.id);
        console.log(" User ID :", req.auth.userId);
        
        // Correction : Utiliser rating au lieu de grade
        const { rating } = req.body;
        const grade = parseInt(rating, 10);  // Convertir en nombre
        
        if (isNaN(grade) || grade < 0 || grade > 5) {
            console.error(" Note invalide !");
            return res.status(400).json({ error: "La note doit être comprise entre 0 et 5." });
        }
        
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.error(" Livre non trouvé !");
            return res.status(404).json({ error: "Livre non trouvé" });
        }
        
        console.log(" Livre trouvé :", book.title);
        
        const existingRating = book.ratings.find(r => r.userId === req.auth.userId);
        if (existingRating) {
            console.error(" L'utilisateur a déjà noté ce livre !");
            return res.status(400).json({ error: "Vous avez déjà noté ce livre" });
        }
        
        book.ratings.push({ userId: req.auth.userId, grade });
        
        // Calcul de la moyenne des notes
        const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
        book.averageRating = total / book.ratings.length;
        
        console.log(" Nouvelle moyenne :", book.averageRating);
        
        await book.save();
        console.log(" Livre mis à jour avec succès !");
        res.status(200).json(book);
    } catch (error) {
        console.error(" Erreur serveur :", error);
        res.status(500).json({ error: error.message });
    }
};





// Modifier un livre
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });
        
        if (book.userId !== req.auth.userId) {
            return res.status(403).json({ error: "Action non autorisée" });
        }
        
        const bookData = req.body;
        if (req.file) {
            bookData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }
        
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Supprimer un livre
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });
        
        if (book.userId !== req.auth.userId) {
            return res.status(403).json({ error: "Action non autorisée" });
        }
        
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Livre supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookById = async (req, res) => {
    console.log("📡 Requête reçue avec l'ID :", req.params.id);
    
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log(" Livre non trouvé !");
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        console.log(" Livre trouvé :", book);
        res.status(200).json(book);
    } catch (error) {
        console.error(" Erreur lors de la récupération du livre :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Récupérer les 3 livres avec la meilleure moyenne de notes
exports.getBestRatedBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .sort({ averageRating: -1 }) // Trie par moyenne décroissante
            .limit(3);

        console.log(" Livres les mieux notés envoyés :", books);
        res.status(200).json(books);
    } catch (error) {
        console.error(" Erreur lors de la récupération des meilleurs livres :", error);
        res.status(500).json({ error: error.message });
    }
};
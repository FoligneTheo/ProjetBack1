const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log("Mot de passe haché :", hashedPassword); // 🔍 Vérification

        const user = new User({
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        res.status(400).json({ error });
    }
});


router.post('/login', async (req, res) => {
    console.log("Tentative de connexion avec :", req.body); // Log des données reçues
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("Utilisateur non trouvé !");
            return res.status(401).json({ message: 'Utilisateur non trouvé !' });
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            console.log("Mot de passe incorrect !");
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log("Connexion réussie ! Token généré :", token);
        res.status(200).json({
            userId: user._id,
            token: token
        });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error });
    }
});

module.exports = router;

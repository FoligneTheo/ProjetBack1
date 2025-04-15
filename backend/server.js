const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

dotenv.config();
console.log("🔐 JWT_SECRET chargé :", process.env.JWT_SECRET);
const app = express();

// ✅ Définition des origines autorisées dynamiquement
const allowedOrigins = [
    'http://localhost:3001', // FRONTEND tourne sur 3001
    'https://mon-site.com', // Remplace par l'URL de ton site en production
'http://localhost:3000',
];

// ✅ Middleware CORS dynamique
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("❌ Requête bloquée par CORS - Origine non autorisée :", origin);
            callback(new Error("Accès interdit par CORS"));
        }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Autoriser l'utilisation des cookies et des tokens
}));

// ✅ Middleware spécial pour gérer les requêtes `OPTIONS`
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// ✅ Middleware pour parser le JSON (OBLIGATOIRE avant les routes)
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// ✅ Déclaration des routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// ✅ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connexion à MongoDB réussie !'))
    .catch(err => console.error('❌ Connexion à MongoDB échouée !', err));

// ✅ Port et lancement du serveur
const PORT = process.env.PORT || 4000; // ✅ BACKEND sur le PORT 3000
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

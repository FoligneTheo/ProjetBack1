const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(" Vérification de l'authentification...");
        console.log(" Token reçu :", req.headers.authorization); 

        if (!req.headers.authorization) {
            console.error(" Aucun header Authorization fourni !");
            return res.status(401).json({ message: "Accès refusé, token manquant" });
        }

        const token = req.headers.authorization.split(" ")[1]; 
        console.log(" Token extrait :", token);

        if (!token) {
            console.error(" Token introuvable après split !");
            return res.status(401).json({ message: "Accès refusé, token invalide" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(" Token décodé :", decodedToken);

        req.auth = { userId: decodedToken.userId }; 
        next();
    } catch (error) {
        console.error(" Erreur lors de la vérification du token :", error.message);
        return res.status(401).json({ message: "Authentification échouée", error: error.message });
    }
};

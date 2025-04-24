const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convertToWebp = async (req, res, next) => {
  if (!req.file) return next();

  const originalPath = req.file.path;
  const newFilename = path.basename(originalPath, path.extname(originalPath)) + '.webp';
  const newPath = path.join(path.dirname(originalPath), newFilename);

  try {
    await sharp(originalPath)
      .webp({ quality: 80 })
      .toFile(newPath);

      fs.unlink(originalPath, (err) => {
        if (err) console.error("Erreur suppression fichier original :", err);
      });
      

    req.file.filename = newFilename;
    req.file.path = newPath;


    next();
  } catch (err) {
    console.error('Erreur conversion WebP :', err);
    res.status(500).json({ message: 'Erreur lors de la conversion de l’image en WebP' });
  }
};

module.exports = convertToWebp;

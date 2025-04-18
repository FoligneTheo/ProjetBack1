const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname
      .split(' ')
      .join('_')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;

    const filename = `${path.parse(originalName).name}-${formattedDate}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

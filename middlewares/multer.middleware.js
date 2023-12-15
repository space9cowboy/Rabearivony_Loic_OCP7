const multer = require("multer");
const sharp = require("sharp");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Modifier cette fonction pour intégrer la compression d'image
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("image");

// Middleware de téléchargement d'image avec compression
const uploadWithCompression = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    // Utilisation de Sharp pour redimensionner et compresser l'image
    sharp(req.file.path)
      .resize({ width: 800 }) // Redimensionnement de l'image
      .toFile("./images/compressed_" + req.file.filename) // Chemin pour l'image compressée
      .then(() => {
        req.file.path = "./images/compressed_" + req.file.filename; // Mettre à jour le chemin vers l'image compressée
        next();
      })
      .catch((error) => {
        return res.status(500).json({ message: "Image processing error" });
      });
  });
};

module.exports = { uploadWithCompression };

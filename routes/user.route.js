const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

// Route pour l'inscription d'un nouvel utilisateur
router.post("/api/auth/signup", UserController.signup);

module.exports = router;

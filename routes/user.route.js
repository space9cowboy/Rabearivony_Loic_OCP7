const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
//contre force brute
const { max } = require("../middlewares/connexion-limiter.middleware");

// Route pour l'inscription d'un nouvel utilisateur
router.post("/api/auth/signup", UserController.signup);
// Route pour l'authentification d'un utilisateur
router.post("/api/auth/login", max, UserController.login);

module.exports = router;

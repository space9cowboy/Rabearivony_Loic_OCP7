const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();
// Contrôleur pour gérer l'inscription d'un nouvel utilisateur
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec le mot de passe haché
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();

    return res.status(201).json({ message: "Inscription réussie." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  signup,
};

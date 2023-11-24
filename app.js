require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

/**
 * * Connexion à la base de données
 */
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mon-vieux-grimoire.8l6kfra.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((error) => console.error("Erreur de connexion à MongoDB:", error));

module.exports = app;

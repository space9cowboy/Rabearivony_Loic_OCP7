require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user.route");
const bookRoutes = require("./routes/book.route");

const app = express();

const toobusy = require("toobusy-js");

const hpp = require("hpp");

const nocache = require("nocache");

/**
 * * Connexion à la base de données
 */
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((error) => console.error("Erreur de connexion à MongoDB:", error));

// Configurations for "body-parser"
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/**
 * * Régler les problèmes de CORS
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors());
app.use(express.json());
// Définir les limites de taille des requêtes (OWASP)
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// surveiller la boucle d'évenement contre les attaques DoS (OWASP)
app.use(function (req, res, next) {
  if (toobusy()) {
    // log if you see necessary
    res.status(503).send("Server Too Busy");
  } else {
    next();
  }
});
// prévenir la pollution des paramètres http (OWASP)
app.use(hpp());
//empêcher les navigateurs de mettre en cache les réponses données (OWASP)
app.use(nocache());

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use(userRoutes);
app.use(bookRoutes);

//gérer l'exception non capturé (OWASP)
process.on("uncaughtException", function (err) {
  // clean up allocated resources
  // log necessary error details to log files
  process.exit(); // exit the process to avoid unknown state
});

module.exports = app;

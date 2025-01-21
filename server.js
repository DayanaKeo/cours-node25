const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;
require('dotenv').config();
const mongoose = require('mongoose');
const log = require('./logFunction');
const {requestLogger} = require('./logFunction'); // Importez la fonction du fichier logger.js
const logFile = 'server.log'; 



//ROUTE
const articleRoute = require('./route/article.route');
const presentationRoute = require('./route/presentation.route');
const messageEmitter = require('./events');
const factureRoute = require('./route/facture.route');
const cryptoRoute = require('./route/crypto.route');

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('BDD connecté');
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion à la base de données:', error);
  });

// Middleware pour lire le body
app.use(bodyParser.json());
app.use(requestLogger(logFile));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


//Déclaration des routes
app.use('/article', articleRoute);
app.use('/presentation', presentationRoute);
app.use('/facture', factureRoute);
app.use('/crypto', cryptoRoute);

// Démarrage du serveur
app.listen(port, () => {
  log.writeLog('server2.log', "Serveur demarré");
  // messageEmitter.emit('message_call', req.url);
  console.log(`Server running on http://localhost:${port}`);
});
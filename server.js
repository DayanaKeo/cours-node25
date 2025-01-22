const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5000;
require('dotenv').config();
const mongoose = require('mongoose');
const log = require('./logFunction');
const {requestLogger} = require('./logFunction'); // Importez la fonction du fichier logger.js
const logFile = 'server.log'; 
const cors = require('cors');
const compression = require('compression');
const { createLogger, format, transports, level, error } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const nodemailer = require('nodemailer');
const path = require('path');
const helmet = require('helmet');

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
//     logFormat
//   ),
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: 'logs/application-%DATE%.log',
//       datePattern: 'DD-MM-YYYY',
//       // zippedArchive: true,
//       maxSize: '10m',
//       maxFiles: '7d'
//     })
//    ]
// });



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
    logger.info('BDD connecté');
  })
  .catch((error) => {
    logger.error('Erreur lors de la connexion à la base de données:', error);
  });

// Middleware pour lire le body
app.use(bodyParser.json());
app.use(requestLogger(logFile));

// logger.on('crit', (err) => {
//   console.log('Pas OK');
//   //envoie mail; sms; notification via un webhook
// });

app.use((req,res,next) => {
  log.rotateLog();
  log.requestLog(req);
  // DATE heure [INFO] [ERROR]
  logger.info(`Requete ${req.method} - ${req.url} - IP : ${req.ip}`)
  messageEmitter.emit('message_call', req.url)

  next();
});


// Middleware pour gérer les erreurs
// app.use((err, req, res, next) => {
//   logger.error(err.stack);
//   res.status(500).send('Something broke!');
//   if (err.critical) {
//       sendCriticalErrorEmail(err);
//   }
// });

//npm i compression
app.use(cors(
  {
    origin : 'http://bci25.portfolio-etudiant-rouen.com',
    methods : ['GET', 'POST'],
    allowedHeaders : ['Content-Type', 'Authorization'], //Autorise les headers, Token
  }
)); //Désactive le cors pour les requêtes

//CLICKJACKING = Empeche l'utilsateur d'etre redirigé vers un autre site sans son consentement
// Empeche les fuite de données
// Empeche le telechargement automatique de fichier dangereux
// Empecher le navigateur de deviner le type MIME d'un fichier (Protection contre les attaques XSS)
// EMPECHE le chargement de script non sécurisé/non autorisé

app.use(helmet()); //Sécurise les headers

//JSON 50KO, 12KO
//GZIP
app.use(compression({
  threshold: 1024,
  filter: (req, res) => {
    if(req.headers['x-no-compression']){
      return false;
    }
    return !req.path.match(/\.(jpg|jpeg|png|gif|mp3|mp4|pdf)$/i);//Filtre les fichiers à ne pas compresser
  }
})); //Compresse les fichiers


const logLevel = {
  levels: {
    info: 0,
    warn: 1,
    error: 2,
    crit: 3,
  }
}


const logFormat = format.combine(
  format.timestamp({format : 'MM-DD-YYYY HH:mm:ss'}),
  format.printf(({timestamp,level,message}) => `${timestamp} [${level.toUpperCase()}] - ${message}`)
);

const logger = createLogger({
  levels: logLevel.levels,
  format : logFormat,
  transports : [
      new transports.Console(),
      new DailyRotateFile({
          filename : path.join(__dirname, './logs/app-%DATE%.log'),
          datePattern: 'MM-DD-YYYY',
          maxSize: '5m',
      }),
      new DailyRotateFile({
          filename : path.join(__dirname, './logs/error-%DATE%.log'),
          datePattern: 'MM-DD-YYYY',
          maxSize: '5m',
      })
  ]
})

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure : process.env.EMAIL_SECURE  === 'true',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  },
  tls : {
      rejectUnauthorized: false
  }
})

async function sendMail(errorMessage){
  try {
      const mailOptions = {
          from: process.env.EMAIL_FROM,
          to : process.env.EMAIL_TO,
          subject : 'ALERTE CRITIQUE',
          text: `Alerte critique : ${errorMessage}`,
          html: `<h2>ALERTE CRITIQUE : ${errorMessage} </h2>`
      };
      await transporter.sendMail(mailOptions);
      console.log('Mail envoyé ');
  }catch (error ){
      console.error('Erreur', error)
  }
}

logger.on('crit', (error) => {
  console.log('Erreur critique detecté ', error.message)
  logger.crit('Erreur critique detecté ' +  error.message)
  sendMail(error.message)
})


//Déclaration des routes
app.use('/article', articleRoute);
app.use('/presentation', presentationRoute);
app.use('/facture', factureRoute);
app.use('/crypto', cryptoRoute);

// Démarrage du serveur
app.listen(port, () => {
  log.writeLog('server2.log', "Serveur demarré");
  log.requestLogger({method:'ok', url:'test'});

  // messageEmitter.emit('message_call', req.url);
  logger.info(`Server running on http://localhost:${port}`);
});
const express = require('express');
const router = express.Router();

const { create } = require('../controller/crypto.controller');
const cors = require('cors');

router.post('/postCrypto',cors(), create); // Créer un nouvel article

module.exports = router;
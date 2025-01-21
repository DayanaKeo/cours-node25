const express = require('express');
const router = express.Router();

const { create } = require('../controller/crypto.controller');

router.post('/postCrypto', create); // Créer un nouvel article

module.exports = router;
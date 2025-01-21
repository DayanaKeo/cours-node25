const express = require('express');
const router = express.Router();
const factureController = require('../controller/facture.controller');

// Route pour générer une facture
router.get('/generationFacture', factureController.generateInvoice);

module.exports = router;

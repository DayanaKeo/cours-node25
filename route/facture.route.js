const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/invoice.controller');

// Route pour générer une facture
router.get('/generationFacture', factureController.generationFacture);

module.exports = router;

const express = require('express');
const router = express.Router();

const presentationController = require('../controller/presentation.controller');


router.get('/getPresentation', presentationController.findAll);
router.post('/', presentationController.createPresentation);
router.put('/:id', presentationController.updatePresentation);

module.exports = router;
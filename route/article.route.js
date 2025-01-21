const express = require('express');
const router = express.Router();

const articleController = require('../controller/article.controller');


router.get('/getArticle', articleController.findAll);
router.post('/createArticle', articleController.createArticle); // Créer un nouvel article

module.exports = router;
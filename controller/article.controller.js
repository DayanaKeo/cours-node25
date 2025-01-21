const Article = require('../model/Article');

exports.findAll = async (req,res) => {
    let article = await Article.find();
    res.json(article);
};

exports.createArticle = async (req, res) => {
    try {
      const { titre, description } = req.body;
  
      const newArticle = new Article({
        titre,
        description,
      });
  
      await newArticle.save();
      res.status(201).json(newArticle);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'article', error });
    }
  };
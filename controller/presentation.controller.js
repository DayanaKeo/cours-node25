const Presentation = require('../model/Presentation');
const Article = require('../model/Article');

// exports.findAll = async (req,res) => {
//     let presentation = await Presentation.find();
//     res.json(presentation);
// };

exports.findAll = async (req, res) => {
    try {
      const presentations = await Presentation.find().populate('article')
      res.status(200).json(presentations);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des présentations', error });
    }
  };

  exports.createPresentation = async (req, res) => {
    try {
      const { name, description, articleId } = req.body;
  
      // Vérifie si l'article existe
      const article = await Article.findById(articleId);
      if (!article) {
        return res.status(404).json({ message: "L'article spécifié n'existe pas" });
      }
  
      const newPresentation = new Presentation({
        name,
        description,
        article: articleId,
      });
  
      await newPresentation.save();
      res.status(201).json(newPresentation);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de la présentation', error });
    }
  };

  // Mettre à jour une présentation
exports.updatePresentation = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, articleId } = req.body;
  
      // Vérifie si l'article existe
      if (articleId) {
        const article = await Article.findById(articleId);
        if (!article) {
          return res.status(404).json({ message: "L'article spécifié n'existe pas" });
        }
      }
  
      const updatedPresentation = await Presentation.findByIdAndUpdate(
        id,
        { name, description, article: articleId },
        { new: true }
      );
  
      if (!updatedPresentation) {
        return res.status(404).json({ message: 'Présentation introuvable' });
      }
  
      res.status(200).json(updatedPresentation);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la présentation', error });
    }
  };
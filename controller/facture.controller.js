const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generateInvoice = async (req, res) => {
  try {
    // Détails fictifs de la facture
    const invoiceData = {
      nomClient: "Jean Dupont",
      numeroFacture: "INV-001",
      date: new Date().toLocaleDateString(),
      items: [
        { description: "Produit A", quantity: 2, price: 15 },
        { description: "Produit B", quantity: 1, price: 25 },
        { description: "Produit C", quantity: 3, price: 10 }
      ]
    };

    const totalAmount = invoiceData.items.reduce((total, item) => total + item.quantity * item.price, 0);

    // Créer un nouveau document PDF
    const doc = new PDFDocument();

    // Chemin du fichier PDF
    const filePath = `${__dirname}/../../invoice.pdf`;

    // Créer un flux d'écriture
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Ajouter du contenu au PDF
    doc.fontSize(20).text("Facture", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Nom du client : ${invoiceData.NomClient}`);
    doc.text(`Numéro de facture : ${invoiceData.numeroFacture}`);
    doc.text(`Date : ${invoiceData.date}`);
    doc.moveDown();

    // Tableau des articles
    doc.text("Articles :", { underline: true });
    invoiceData.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.description} - Quantité : ${item.quantity}, Prix : ${item.price} €`
      );
    });

    // Total
    doc.moveDown();
    doc.text(`Montant total : ${totalAmount} €`, { bold: true });

    // Terminer et enregistrer le PDF
    doc.end();

    // Attendre la fin de l'écriture
    writeStream.on("finish", () => {
      res.status(200).json({
        message: "Facture générée avec succès.",
        path: filePath,
      });
    });

    writeStream.on("error", (error) => {
      res.status(500).json({ message: "Erreur lors de la génération du PDF.", error });
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne.", error });
  }
};

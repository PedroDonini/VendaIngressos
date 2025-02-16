const mongoose = require('mongoose');

const IngressoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  estoque: { type: Number, required: true },
});

module.exports = mongoose.model('Ingresso', IngressoSchema);

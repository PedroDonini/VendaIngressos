const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  itens: [{
    ingresso: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingresso', required: true },
    quantidade: { type: Number, required: true },
  }],
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Compra', CompraSchema);

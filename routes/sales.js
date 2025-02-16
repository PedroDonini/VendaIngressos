const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Compra = require('../models/Compra');
const Ingresso = require('../models/Ingresso');
const { authenticate } = require('../middlewares/auth');

// Rota para compra de ingressos
router.post('/', authenticate, async (req, res) => {
  // Espera payload no formato: { itens: [{ ingressoId, quantidade }] }
  const { itens } = req.body;
  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ message: 'Itens da compra são obrigatórios' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Para cada item, verifica o estoque e decrementa se possível
    for (const item of itens) {
      const { ingressoId, quantidade } = item;
      const ingresso = await Ingresso.findOne({
        _id: ingressoId,
        estoque: { $gte: quantidade }
      }).session(session);
      if (!ingresso) {
        throw new Error(`Estoque insuficiente para o ingresso ${ingressoId}`);
      }
      ingresso.estoque -= quantidade;
      await ingresso.save({ session });
    }

    // Registra a compra
    const compra = new Compra({
      usuario: req.user._id,
      itens: itens.map(item => ({
        ingresso: item.ingressoId,
        quantidade: item.quantidade,
      }))
    });
    await compra.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Compra realizada com sucesso', compra });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

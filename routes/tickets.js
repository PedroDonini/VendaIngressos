const express = require('express');
const router = express.Router();
const Ingresso = require('../models/Ingresso');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Listar todos os ingressos
router.get('/', async (req, res) => {
  try {
    const ingressos = await Ingresso.find();
    res.json(ingressos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ingressos', error });
  }
});

// Obter detalhes de um ingresso
router.get('/:id', async (req, res) => {
  try {
    const ingresso = await Ingresso.findById(req.params.id);
    if (!ingresso) {
      return res.status(404).json({ message: 'Ingresso não encontrado' });
    }
    res.json(ingresso);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ingresso', error });
  }
});

// Criar novo ingresso (apenas admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  const { nome, preco, estoque } = req.body;
  try {
    const ingresso = new Ingresso({ nome, preco, estoque });
    await ingresso.save();
    res.status(201).json({ message: 'Ingresso criado com sucesso', ingresso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar ingresso', error });
  }
});

// Atualizar ingresso (apenas admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  const { nome, preco, estoque } = req.body;
  try {
    const ingresso = await Ingresso.findByIdAndUpdate(
      req.params.id,
      { nome, preco, estoque },
      { new: true }
    );
    if (!ingresso) {
      return res.status(404).json({ message: 'Ingresso não encontrado' });
    }
    res.json({ message: 'Ingresso atualizado com sucesso', ingresso });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar ingresso', error });
  }
});

// Remover ingresso (apenas admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const ingresso = await Ingresso.findByIdAndDelete(req.params.id);
    if (!ingresso) {
      return res.status(404).json({ message: 'Ingresso não encontrado' });
    }
    res.json({ message: 'Ingresso removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover ingresso', error });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { JWT_SECRET } = require('../middlewares/auth');

// Registro de usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha, role } = req.body;
  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    const usuario = new Usuario({ nome, email, senha, role });
    await usuario.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    const isMatch = await usuario.comparePassword(senha);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }
    // Gera token JWT com validade de 1 dia
    const token = jwt.sign({ id: usuario._id, role: usuario.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login', error });
  }
});

module.exports = router;

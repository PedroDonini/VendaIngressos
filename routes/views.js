const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');

// Página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Middleware para extrair o token da query e decodificá-lo
router.use((req, res, next) => {
  if (req.query.token) {
    try {
      req.user = jwt.verify(req.query.token, JWT_SECRET);
    } catch (error) {
      req.user = null;
    }
  }
  next();
});

// Página de histórico de compras (apenas para usuário autenticado)
router.get('/history', async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  try {
    const compras = await Compra.find({ usuario: req.user.id })
      .populate('itens.ingresso')
      .sort({ data: -1 });
    res.render('history', { compras, token: req.query.token });
  } catch (error) {
    res.status(500).send('Erro ao buscar histórico de compras');
  }
});

module.exports = router;
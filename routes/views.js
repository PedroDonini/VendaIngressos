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

module.exports = router;
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = 'your_secret_key'; //

// Middleware para verificar o token JWT
const authenticate = async (req, res, next) => {
  // Espera o token no header Authorization no formato "Bearer token"
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await Usuario.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acesso negado: apenas administradores' });
};

module.exports = { authenticate, isAdmin, JWT_SECRET };

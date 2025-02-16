const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
});

// Realiza o hash da senha e salva
UsuarioSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
  }
  next();
});

// Método para comparar senha
UsuarioSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);

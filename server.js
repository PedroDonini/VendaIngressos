const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');

const app = express();

// Conexão com o MongoDB (base de dados local)

mongoose.connect('mongodb://localhost:27017')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Middleware para interpretar JSON e URL encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Importação das rotas
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const salesRoutes = require('./routes/sales');
const viewRoutes = require('./routes/views');

// Rotas da API REST
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/sales', salesRoutes);

// Rotas para as views (Mustache)
app.use('/', viewRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

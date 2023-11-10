const express = require('express');
const cors = require('cors'); // Adicionando a linha para requerer o pacote CORS
const cidadeRoutes = require('./api/routes/cidadeRoutes');
const aeroportoRoutes = require('./api/routes/aeroportoRoutes');

const app = express();
const port = 3000;

// Habilitando o CORS para todas as rotas
app.use(cors());

// Middleware para parsear o corpo das requisições em JSON
app.use(express.json());

// Rota para o CRUD de cidades
app.use('/cidades', cidadeRoutes);

// Rota para o CRUD de aeroportos
app.use('/aeroportos', aeroportoRoutes);

// Inicializa o servidor na porta especificada e loga uma mensagem para o console
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

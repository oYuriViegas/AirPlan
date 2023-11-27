const express = require('express');
const cors = require('cors');
const cidadeRoutes = require('./api/routes/cidadeRoutes');
const aeroportoRoutes = require('./api/routes/aeroportoRoutes');
const aeronaveRoutes = require('./api/routes/aeronaveRoutes');
const trechoRoutes = require('./api/routes/trechoRoutes');      
const vooRoutes = require('./api/routes/vooRoutes');     
const consultaVooRouter = require('./api/routes/consultaVooRouter');  
const reservaRoutes = require('./api/routes/reservaRoutes');
const assentoRoutes = require('./api/routes/assentoRoutes');    
const clienteRoutes = require('./api/routes/clienteRoutes');    

const app = express();
const port = 3000;

// Habilitando o CORS para todas as rotas
app.use(cors());

// Middleware para parsear o corpo das requisições em JSON
app.use(express.json());

// Rotas para o CRUD de cada entidade
app.use('/cidades', cidadeRoutes);
app.use('/aeroportos', aeroportoRoutes);
app.use('/aeronaves', aeronaveRoutes);   
app.use('/trechos', trechoRoutes);       
app.use('/voos', vooRoutes);
app.use('/consultaVoos', consultaVooRouter); // Rota para a consulta de voos
app.use('/reservas', reservaRoutes);
app.use('/clientes', clienteRoutes);     
app.use('/assentos', assentoRoutes);     

// Inicializa o servidor na porta especificada e loga uma mensagem para o console
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

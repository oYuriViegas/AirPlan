const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');

const app = express();
const PORT = 3000;

// Configuração do banco de dados
const dbConfig = {
  user: 'System',
  password: 'senha',
  connectString: 'localhost:1521/XE'
};

// Middleware para analisar o corpo da solicitação como JSON
app.use(bodyParser.json());

// Rota para inserir dados das aeronaves no banco
app.post('/inserir-aeronave', async (req, res) => {
  try {
    const { modelo, identificacao, fabricante, anoFabricacao } = req.body;

    const connection = await oracledb.getConnection(dbConfig);

    const sql = `INSERT INTO Aeronaves (Modelo, NumeroIdentificacao, Fabricante, AnoFabricacao)
                 VALUES (:modelo, :identificacao, :fabricante, :anoFabricacao)`;
    
    const bindParams = {
      modelo,
      identificacao,
      fabricante,
      anoFabricacao
    };

    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    connection.close();
    res.json({ message: 'Aeronave inserida com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao inserir aeronave no banco de dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor em execução na porta ${PORT}`);
});
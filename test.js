app.use(bodyParser.json());

// Rota para inserir dados das aeronaves no banco
app.post('/inserir-aeronave', async (req, res) => {
  try {
    const { modelo, identificacao, fabricante, anoFabricacao } = req.body;
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `INSERT INTO Aeronaves (Modelo, NumeroIdentificacao, Fabricante, AnoFabricacao)
       VALUES (:modelo, :identificacao, :fabricante, :anoFabricacao)`,
      [modelo, identificacao, fabricante, anoFabricacao]
    );

    connection.release();
    res.json({ message: 'Aeronave inserida com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao inserir aeronave no banco de dados.' });
  }
});
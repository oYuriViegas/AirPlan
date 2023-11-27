// Importar o módulo oracledb e as funções de conexão
const oracledb = require('oracledb');
const db = require('../db.js'); // Ajuste o caminho conforme sua estrutura de diretório

// Função para listar todas as aeronaves
async function getAllAeronaves(req, res) {
  let connection;
  try {
    connection = await db.openConnection();
    const result = await connection.execute(`SELECT * FROM Aeronaves`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter aeronaves', error);
    res.status(500).send('Erro ao obter aeronaves');
  } finally {
    if (connection) {
      try {
        await db.closeConnection(connection);
      } catch (error) {
        console.error('Erro ao fechar a conexão', error);
      }
    }
  }
}

// Função para obter uma única aeronave pelo ID
// No arquivo aeronaveController.js

async function getAeronaveById(req, res) {
  let connection;
  try {
      const id = parseInt(req.params.id); // Certifique-se de que o ID é um número

      if (isNaN(id)) {
          return res.status(400).send('ID inválido');
      }

      connection = await db.openConnection();
      const result = await connection.execute(
          `SELECT * FROM Aeronaves WHERE AeronaveID = :id`,
          [id],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (result.rows.length > 0) {
          res.json(result.rows[0]);
      } else {
          res.status(404).send('Aeronave não encontrada');
      }
  } catch (error) {
      console.error('Erro ao obter a aeronave com ID', id, error);
      res.status(500).send('Erro ao obter aeronave');
  } finally {
      if (connection) {
          await db.closeConnection(connection);
      }
  }
}


// Função para adicionar uma nova aeronave
async function createAeronave(req, res) {
  let connection;
  const { modelo, numeroIdentificacao, fabricante, anoFabricacao, qtdLinhas, qtdColunas } = req.body;
  try {
    connection = await db.openConnection();
    const sql = `INSERT INTO Aeronaves (Modelo, NumeroIdentificacao, Fabricante, AnoFabricacao, QtdLinhas, QtdColunas) VALUES (:modelo, :numeroIdentificacao, :fabricante, :anoFabricacao, :qtdLinhas, :qtdColunas)`;
    await connection.execute(sql, [modelo, numeroIdentificacao, fabricante, anoFabricacao, qtdLinhas, qtdColunas], { autoCommit: true });
    res.status(201).json({ message: 'Aeronave criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar aeronave', error);
    res.status(500).json({ message: 'Erro ao criar aeronave' });
  } finally {
    if (connection) {
      try {
        await db.closeConnection(connection);
      } catch (error) {
        console.error('Erro ao fechar a conexão', error);
      }
    }
  }
}

// Função para atualizar uma aeronave existente
async function updateAeronave(req, res) {
  let connection;
  const { id } = req.params;
  const { modelo, numeroIdentificacao, fabricante, anoFabricacao, qtdLinhas, qtdColunas } = req.body;

  try {
    connection = await db.openConnection();
    const sql = `UPDATE Aeronaves SET Modelo = :modelo, NumeroIdentificacao = :numeroIdentificacao, Fabricante = :fabricante, AnoFabricacao = :anoFabricacao, QtdLinhas = :qtdLinhas, QtdColunas = :qtdColunas WHERE AeronaveID = :id`;
    const result = await connection.execute(sql, [modelo, numeroIdentificacao, fabricante, anoFabricacao, qtdLinhas, qtdColunas, id], { autoCommit: true });
    if (result.rowsAffected === 0) {
      res.status(404).send('Aeronave não encontrada ou não alterada');
    } else {
      res.json({ message: 'Aeronave atualizada com sucesso' });
    }
  } catch (error) {
    console.error(`Erro ao atualizar a aeronave com ID ${id}`, error);
    res.status(500).send('Erro ao atualizar aeronave');
  } finally {
    if (connection) {
      try {
        await db.closeConnection(connection);
      } catch (error) {
        console.error('Erro ao fechar a conexão', error);
      }
    }
  }
}

// Função para remover uma aeronave
async function deleteAeronave(req, res) {
  let connection;
  const { id } = req.params;
  try {
    connection = await db.openConnection();
    const sql = `DELETE FROM Aeronaves WHERE AeronaveID = :id`;
    const result = await connection.execute(sql, [id], { autoCommit: true });
    if (result.rowsAffected === 0) {
      res.status(404).send('Aeronave não encontrada');
    } else {
      res.json({ message: 'Aeronave removida com sucesso' });
    }
  } catch (error) {
    console.error(`Erro ao deletar a aeronave com ID ${id}`, error);
    res.status(500).send('Erro ao deletar aeronave');
  } finally {
    if (connection) {
      try {
        await db.closeConnection(connection);
      } catch (error) {
        console.error('Erro ao fechar a conexão', error);
      }
    }
  }
}

module.exports = {
  getAllAeronaves,
  getAeronaveById,
  createAeronave,
  updateAeronave,
  deleteAeronave
};

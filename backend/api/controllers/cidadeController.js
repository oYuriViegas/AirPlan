// /backend/api/controllers/cidadeController.js

const oracledb = require('oracledb');
const db = require('../db.js'); // Caminho ajustado conforme sua estrutura de diretório

// Função para listar todas as cidades
async function getAllCidades(req, res) {
  let connection;

  try {
    connection = await db.openConnection();

    const result = await connection.execute(`SELECT * FROM Cidades`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter cidades', error);
    res.status(500).send('Erro ao obter cidades');
  } finally {
    await db.closeConnection(connection);
  }
}

// Função para obter uma única cidade pelo ID
async function getCidadeById(req, res) {
  let connection;
  const { id } = req.params;

  try {
    connection = await db.openConnection();

    const result = await connection.execute(`SELECT * FROM Cidades WHERE CidadeID = :id`, [id], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Cidade não encontrada');
    }
  } catch (error) {
    console.error(`Erro ao obter a cidade com ID ${id}`, error);
    res.status(500).send('Erro ao obter cidade');
  } finally {
    await db.closeConnection(connection);
  }
}

// Função para adicionar uma nova cidade
async function createCidade(req, res) {
  let connection;
  const { nome, estado } = req.body; // Incluindo o novo campo estado

  try {
    connection = await db.openConnection();

    const sql = `INSERT INTO Cidades (nome, estado) VALUES (:nome, :estado)`;
    const result = await connection.execute(sql, [nome, estado], {
      autoCommit: true,
    });

    res.status(201).json({ message: 'Cidade criada com sucesso', id: result.lastRowid });
  } catch (error) {
    console.error('Erro ao criar cidade', error);
    res.status(500).send('Erro ao criar cidade');
  } finally {
    await db.closeConnection(connection);
  }
}

// Função para atualizar uma cidade existente
// Função para atualizar uma cidade existente
async function updateCidade(req, res) {
  let connection;
  const { id } = req.params;
  const { NOME, ESTADO } = req.body; // Certifique-se de que esses nomes de campos correspondem ao que você está enviando do frontend

  try {
    connection = await db.openConnection();

    const sql = `UPDATE Cidades SET Nome = :NOME, Estado = :ESTADO WHERE CidadeID = :id`;
    const result = await connection.execute(sql, [NOME, ESTADO, id], {
      autoCommit: true,
    });

    if (result.rowsAffected === 0) {
      res.status(404).send('Cidade não encontrada ou não alterada');
    } else {
      res.json({ message: 'Cidade atualizada com sucesso' });
    }
  } catch (error) {
    console.error(`Erro ao atualizar a cidade com ID ${id}`, error);
    res.status(500).send('Erro ao atualizar cidade');
    // É uma boa prática logar o erro também
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


// Função para remover uma cidade
async function deleteCidade(req, res) {
  let connection;
  const { id } = req.params;

  try {
    connection = await db.openConnection();

    const sql = `DELETE FROM Cidades WHERE CidadeID = :id`;
    const result = await connection.execute(sql, [id], {
      autoCommit: true,
    });

    if (result.rowsAffected === 0) {
      res.status(404).send('Cidade não encontrada');
    } else {
      res.json({ message: 'Cidade removida com sucesso' });
    }
  } catch (error) {
    console.error(`Erro ao deletar a cidade com ID ${id}`, error);
    res.status(500).send('Erro ao deletar cidade');
  } finally {
    await db.closeConnection(connection);
  }
}

module.exports = {
  getAllCidades,
  getCidadeById,
  createCidade,
  updateCidade,
  deleteCidade
};

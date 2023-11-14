// Importar o módulo oracledb e as funções de conexão
const oracledb = require('oracledb');
const db = require('../db.js'); // Ajuste o caminho conforme sua estrutura de diretório

// Função para listar todos os aeroportos
async function getAllAeroportos(req, res) {
  let connection;
  try {
    connection = await db.openConnection();
    const result = await connection.execute(`SELECT * FROM Aeroportos`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter aeroportos', error);
    res.status(500).send('Erro ao obter aeroportos');
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

// Função para obter um único aeroporto pelo ID
async function getAeroportoById(req, res) {
  let connection;
  const { id } = req.params;
  try {
    connection = await db.openConnection();
    const result = await connection.execute(`SELECT * FROM Aeroportos WHERE AeroportoID = :id`, [id], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Aeroporto não encontrado');
    }
  } catch (error) {
    console.error(`Erro ao obter o aeroporto com ID ${id}`, error);
    res.status(500).send('Erro ao obter aeroporto');
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

// Função para adicionar um novo aeroporto
async function createAeroporto(req, res) {
    let connection;
    const { nome, sigla, cidadeId } = req.body;
  
    try {
      connection = await db.openConnection();
      const sql = `INSERT INTO Aeroportos (Nome, Sigla, CidadeID) VALUES (:nome, :sigla, :cidadeId)`;
      await connection.execute(sql, [nome, sigla, cidadeId], { autoCommit: true });
      res.status(201).json({ message: 'Aeroporto criado com sucesso' });
    } catch (error) {
      if (error.errorNum === 2291) {
        res.status(400).json({ message: 'CidadeID fornecido não existe na tabela Cidades' });
      } else {
        console.error('Erro ao criar aeroporto', error);
        res.status(500).json({ message: 'Erro ao criar aeroporto' });
      }
    } finally {
      await db.closeConnection(connection);
    }
  }
  

// Função para atualizar um aeroporto existente
async function updateAeroporto(req, res) {
  let connection;
  const { id } = req.params;
  const { nome, sigla, cidadeId } = req.body;
  try {
    connection = await db.openConnection();
    const sql = `UPDATE Aeroportos SET Nome = :nome, Sigla = :sigla, CidadeID = :cidadeId WHERE AeroportoID = :id`; // Adicionar a sigla na consulta
    const result = await connection.execute(sql, [nome, sigla, cidadeId, id], { autoCommit: true });
    if (result.rowsAffected === 0) {
      res.status(404).send('Aeroporto não encontrado ou não alterado');
    } else {
      res.json({ message: 'Aeroporto atualizado com sucesso' });
    }
  } catch (error) {
    console.error(`Erro ao atualizar o aeroporto com ID ${id}`, error);
    res.status(500).send('Erro ao atualizar aeroporto');
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

// Função para remover um aeroporto
async function deleteAeroporto(req, res) {
  let connection;
  const { id } = req.params;
  try {
    connection = await db.openConnection();
    const sql = `DELETE FROM Aeroportos WHERE AeroportoID = :id`;
    const result = await connection.execute(sql, [id], { autoCommit: true });
    if (result.rowsAffected === 0) {
      res.status(404).send('Aeroporto não encontrado');
    } else {
      res.json({ message: 'Aeroporto removido com sucesso' });
    }
  } catch (error) {
    console.error(`Erro ao deletar o aeroporto com ID ${id}`, error);
    res.status(500).send('Erro ao deletar aeroporto');
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
  getAllAeroportos,
  getAeroportoById,
  createAeroporto,
  updateAeroporto,
  deleteAeroporto
};

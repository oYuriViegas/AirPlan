// /backend/api/db.js

const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

async function openConnection() {
  let connection;

  try {
    // Tentar estabelecer uma conexão com o banco de dados usando as configurações definidas
    connection = await oracledb.getConnection(dbConfig);

    // Retorna a conexão para ser usada pelo chamador
    return connection;
  } catch (err) {
    // Se houver um erro ao conectar, ele será logado e o erro será lançado novamente
    console.error('Erro ao conectar ao banco de dados', err);
    throw err;
  }
}

async function closeConnection(connection) {
  if (connection) {
    try {
      // Se a conexão foi estabelecida, tentar fechá-la
      await connection.close();
    } catch (err) {
      // Se houver um erro ao fechar a conexão, ele será logado
      console.error('Erro ao fechar a conexão com o banco de dados', err);
    }
  }
}

module.exports = {
  openConnection,
  closeConnection
};

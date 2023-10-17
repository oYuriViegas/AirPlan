const oracledb = require('oracledb');
const dbConfig = {
  user: 'System',
  password: 'senha',
  connectString: 'localhost:1521/XE', 
};

oracledb.getConnection(dbConfig, (err, connection) => {
    if (err) {
      console.error('Erro ao conectar ao Oracle Database:', err.message);
    } else {
      console.log('Conexão ao Oracle Database estabelecida com sucesso.');
      ;
    }
  });
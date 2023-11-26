// consultaVooController.js
const db = require('../db'); // Caminho para o seu módulo de conexão com o banco
const oracledb = require('oracledb');

async function getVoosPorCidade(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const { origem, destino } = req.query;
        const sql = `SELECT
                        c1.Nome AS CidadeOrigem,
                        c2.Nome AS CidadeDestino,
                        v.DataHoraPartida,
                        v.DataHoraChegada,
                        v.ValorAssento
                    FROM Voos v
                    JOIN Trechos t ON v.TrechoID = t.TrechoID
                    JOIN Aeroportos a1 ON t.OrigemID = a1.AeroportoID
                    JOIN Aeroportos a2 ON t.DestinoID = a2.AeroportoID
                    JOIN Cidades c1 ON a1.CidadeID = c1.CidadeID
                    JOIN Cidades c2 ON a2.CidadeID = c2.CidadeID
                    WHERE
                        c1.Nome = :origem
                        AND c2.Nome = :destino`;
        const result = await connection.execute(sql, [origem, destino], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter voos', error);
        res.status(500).send('Erro ao obter voos');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}


module.exports = {
    getVoosPorCidade
};

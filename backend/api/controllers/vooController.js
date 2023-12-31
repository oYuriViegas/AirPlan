const oracledb = require('oracledb');
const db = require('../db.js'); // Ajuste o caminho conforme necessário

async function getAllVoos(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(`SELECT * FROM Voos`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
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

async function getVoosComDetalhes(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const sql = `SELECT
                        v.VooID,
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
                     JOIN Cidades c2 ON a2.CidadeID = c2.CidadeID`;
        const result = await connection.execute(sql, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter voos com detalhes', error);
        res.status(500).send('Erro ao obter voos com detalhes');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function getVooById(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(`SELECT * FROM Voos WHERE VooID = :id`, [id], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Voo não encontrado');
        }
    } catch (error) {
        console.error(`Erro ao obter o voo com ID ${id}`, error);
        res.status(500).send('Erro ao obter voo');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function getAssentosReservadosVoo(req, res) {
    let connection;
    const { vooId } = req.params;
    try {
        connection = await db.openConnection();
        const sql = `
            SELECT AssentoID FROM Reservas
            WHERE VooID = :vooId
        `;
        const result = await connection.execute(sql, [vooId], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter assentos reservados do voo:', error);
        res.status(500).send('Erro ao obter assentos reservados do voo');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function createVoo(req, res) {
    let connection;
    const { AeronaveID, TrechoID, DataHoraPartida, DataHoraChegada, ValorAssento } = req.body;
    console.log(req.body);
    try {
        connection = await db.openConnection();
        const sql = `INSERT INTO Voos (AeronaveID, TrechoID, DataHoraPartida, DataHoraChegada, ValorAssento) VALUES (:AeronaveID, :TrechoID, TO_TIMESTAMP_TZ(:DataHoraPartida, 'YYYY-MM-DD"T"HH24:MI:SS.FF3TZH:TZM'), TO_TIMESTAMP_TZ(:DataHoraChegada, 'YYYY-MM-DD"T"HH24:MI:SS.FF3TZH:TZM'), :ValorAssento)`;
        console.log(sql);
        await connection.execute(sql, [AeronaveID, TrechoID, DataHoraPartida, DataHoraChegada, ValorAssento], { autoCommit: true });
        res.status(201).json({ message: 'Voo criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar voo', error);
        res.status(500).json({ message: 'Erro ao criar voo' });
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function updateVoo(req, res) {
    let connection;
    const { id } = req.params;
    const { AeronaveID, TrechoID, DataHoraPartida, DataHoraChegada, ValorAssento } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `UPDATE Voos SET AeronaveID = :AeronaveID, TrechoID = :TrechoID, DataHoraPartida = :DataHoraPartida, DataHoraChegada = :DataHoraChegada, ValorAssento = :ValorAssento WHERE VooID = :id`;
        const result = await connection.execute(sql, [AeronaveID, TrechoID, DataHoraPartida, DataHoraChegada, ValorAssento, id], { autoCommit: true });
        if (result.rowsAffected === 0) {
            res.status(404).send('Voo não encontrado ou não alterado');
        } else {
            res.json({ message: 'Voo atualizado com sucesso' });
        }
    } catch (error) {
        console.error(`Erro ao atualizar o voo com ID ${id}`, error);
        res.status(500).send('Erro ao atualizar voo');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function deleteVoo(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const sql = `DELETE FROM Voos WHERE VooID = :id`;
        const result = await connection.execute(sql, [id], { autoCommit: true });
        if (result.rowsAffected === 0) {
            res.status(404).send('Voo não encontrado');
        } else {
            res.json({ message: 'Voo removido com sucesso' });
        }
    } catch (error) {
        console.error(`Erro ao deletar o voo com ID ${id}`, error);
        res.status(500).send('Erro ao deletar voo');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

module.exports = {
    getAllVoos,
    getVoosComDetalhes,
    getVooById,
    getAssentosReservadosVoo,
    createVoo,
    updateVoo,
    deleteVoo
};
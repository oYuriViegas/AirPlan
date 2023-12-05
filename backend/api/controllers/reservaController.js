const oracledb = require('oracledb');
const db = require('../db.js'); // Ajuste o caminho conforme necessário

async function getAllReservas(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(`SELECT * FROM Reservas`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter reservas', error);
        res.status(500).send('Erro ao obter reservas');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function getReservaById(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(`SELECT * FROM Reservas WHERE ReservaID = :id`, [id], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Reserva não encontrada');
        }
    } catch (error) {
        console.error(`Erro ao obter a reserva com ID ${id}`, error);
        res.status(500).send('Erro ao obter reserva');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function createReserva(req, res) {
    let connection;
    const { VooID, ClienteID, AssentoID } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `INSERT INTO Reservas (VooID, ClienteID, AssentoID) VALUES (:VooID, :ClienteID, :AssentoID)`;
        await connection.execute(sql, [VooID, ClienteID, AssentoID], { autoCommit: true });
        res.status(201).json({ message: 'Reserva criada com sucesso' });
    } catch (error) {
        console.error('Erro ao criar reserva', error);
        res.status(500).json({ message: 'Erro ao criar reserva' });
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function updateReserva(req, res) {
    let connection;
    const { id } = req.params;
    const { VooID, ClienteID, AssentoID } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `UPDATE Reservas SET VooID = :VooID, ClienteID = :ClienteID, AssentoID = :AssentoID WHERE ReservaID = :id`;
        const result = await connection.execute(sql, [VooID, ClienteID, AssentoID, id], { autoCommit: true });
        if (result.rowsAffected > 0) {
            res.json({ message: 'Reserva atualizada com sucesso' });
        } else {
            res.status(404).send('Reserva não encontrada ou não alterada');
        }
    } catch (error) {
        console.error(`Erro ao atualizar a reserva com ID ${id}`, error);
        res.status(500).send('Erro ao atualizar reserva');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

async function deleteReserva(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const sql = `DELETE FROM Reservas WHERE ReservaID = :id`;
        const result = await connection.execute(sql, [id], { autoCommit: true });
        if (result.rowsAffected > 0) {
            res.json({ message: 'Reserva excluída com sucesso' });
        } else {
            res.status(404).send('Reserva não encontrada');
        }
    } catch (error) {
        console.error(`Erro ao deletar a reserva com ID ${id}`, error);
        res.status(500).send('Erro ao deletar reserva');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

module.exports = {
    getAllReservas,
    getReservaById,
    createReserva,
    updateReserva,
    deleteReserva
};

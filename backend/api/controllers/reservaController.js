const oracledb = require('oracledb');
const db = require('../db.js');

// Função para listar todas as reservas
async function getAllReservas(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(
            `SELECT * FROM Reservas`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar reservas:', error);
        res.status(500).send('Erro ao obter reservas');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para criar uma nova reserva
async function createReserva(req, res) {
    let connection;
    const { VooID, ClienteID, Assentos } = req.body; // Removido o Status
    console.log(req.body);
    console.log(VooID, ClienteID, AssentosID);
    try {
        connection = await db.openConnection();

        // Verificar se os assentos estão disponíveis
        const assentosIndisponiveis = [];
        for (const AssentoID of Assentos) {
            const checkSql = `SELECT 1 FROM Reservas WHERE AssentoID = :AssentoID AND VooID = :VooID`;
            const result = await connection.execute(checkSql, [AssentoID, VooID], { outFormat: oracledb.OUT_FORMAT_OBJECT });
            if (result.rows.length > 0) {
                assentosIndisponiveis.push(AssentoID);
            }
        }

        // Se houver assentos indisponíveis, não continuar com a reserva
        if (assentosIndisponiveis.length > 0) {
            res.status(400).json({ message: 'Os seguintes assentos não estão disponíveis', assentos: assentosIndisponiveis });
            return;
        }

        // Iniciar uma transação
        await connection.execute(`BEGIN`);

        // Inserir reserva para cada assento
        const sql = `INSERT INTO Reservas (VooID, ClienteID, AssentoID) VALUES (:VooID, :ClienteID, :AssentoID)`;
        for (const AssentoID of Assentos) {
            await connection.execute(sql, [VooID, ClienteID, AssentoID], { autoCommit: false });
        }

        // Finalizar a transação
        await connection.execute(`COMMIT`);

        res.status(201).json({ message: 'Reserva criada com sucesso' });
    } catch (error) {
        // Desfazer a transação em caso de erro
        await connection.execute(`ROLLBACK`);
        console.error('Erro ao criar reserva:', error);
        res.status(500).json({ message: 'Erro ao criar reserva' });
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}


// Função para obter uma reserva específica pelo ID
async function getReservaById(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(
            `SELECT * FROM Reservas WHERE ReservaID = :id`,
            [id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Reserva não encontrada');
        }
    } catch (error) {
        console.error(`Erro ao obter a reserva com ID ${id}:`, error);
        res.status(500).send('Erro ao obter reserva');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para atualizar uma reserva
async function updateReserva(req, res) {
    let connection;
    const { id } = req.params;
    const { VooID, ClienteID, AssentoID, Status } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `UPDATE Reservas SET VooID = :VooID, ClienteID = :ClienteID, AssentoID = :AssentoID, Status = :Status WHERE ReservaID = :id`;
        const result = await connection.execute(sql, [VooID, ClienteID, AssentoID, Status, id], { autoCommit: true });
        if (result.rowsAffected > 0) {
            res.json({ message: 'Reserva atualizada com sucesso' });
        } else {
            res.status(404).send('Reserva não encontrada ou não alterada');
        }
    } catch (error) {
        console.error(`Erro ao atualizar a reserva com ID ${id}:`, error);
        res.status(500).send('Erro ao atualizar reserva');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para excluir uma reserva
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
        console.error(`Erro ao deletar a reserva com ID ${id}:`, error);
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
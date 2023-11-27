const oracledb = require('oracledb');
const db = require('../db.js');

// Lista todos os assentos de uma aeronave que não estão reservados para um determinado voo
async function getAssentosDisponiveis(req, res) {
    let connection;
    try {
        const { aeronaveId, vooId } = req.params;
        connection = await db.openConnection();
        const result = await connection.execute(
            `SELECT a.AssentoID, a.CodigoAssento, a.Linha, a.Coluna
             FROM Assentos a
             WHERE a.AeronaveID = :aeronaveId
             AND NOT EXISTS (
                 SELECT 1
                 FROM Reservas r
                 WHERE r.AssentoID = a.AssentoID
                 AND r.VooID = :vooId
             )`,
            [aeronaveId, vooId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter assentos disponíveis:', error);
        res.status(500).send('Erro ao obter assentos disponíveis');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Reserva um assento para um cliente em um voo específico
async function reservarAssento(req, res) {
    let connection;
    try {
        const { vooId, clienteId, assentoId } = req.body;
        connection = await db.openConnection();
        
        // Iniciar uma transação
        await connection.execute(`BEGIN`);
        
        // Verificar se o assento está disponível
        const verificaDisponibilidade = await connection.execute(
            `SELECT 1 FROM Reservas
             WHERE AssentoID = :assentoId AND VooID = :vooId`,
            [assentoId, vooId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (verificaDisponibilidade.rows.length > 0) {
            throw new Error('Assento já está reservado para este voo');
        }

        // Reservar o assento
        const sqlReserva = `INSERT INTO Reservas (VooID, ClienteID, AssentoID, Status) VALUES (:VooID, :ClienteID, :AssentoID, 'Reservado')`;
        await connection.execute(sqlReserva, { VooID: vooId, ClienteID: clienteId, AssentoID: assentoId }, { autoCommit: false });

        // Finalizar a transação
        await connection.execute(`COMMIT`);
        
        res.status(201).json({ message: 'Assento reservado com sucesso' });
    } catch (error) {
        await connection.execute(`ROLLBACK`);
        console.error('Erro ao reservar assento:', error);
        res.status(500).send('Erro ao reservar assento');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

module.exports = {
    getAssentosDisponiveis,
    reservarAssento
};

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


// Função para buscar AssentoID
async function getAssentoId(req, res) {
    let connection;
    try {
        const { aeronaveId, codigoAssento } = req.params;
        connection = await db.openConnection();
        const sql = `SELECT AssentoID FROM Assentos WHERE AeronaveID = :aeronaveId AND CodigoAssento = :codigoAssento`;
        const result = await connection.execute(sql, [aeronaveId, codigoAssento], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Assento não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar AssentoID:', error);
        res.status(500).send('Erro ao buscar AssentoID');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para obter todos os assentos de uma aeronave específica
async function getAssentosByAeronaveId(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const aeronaveId = req.params.aeronaveId; // Pegar o ID da aeronave dos parâmetros da rota

        const result = await connection.execute(
            `SELECT * FROM Assentos WHERE AeronaveID = :aeronaveId`,
            [aeronaveId], // Usar o ID da aeronave na consulta
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // Enviar os assentos encontrados como resposta
        res.json(result.rows);
    } catch (error) {
        console.error(`Erro ao obter assentos para a aeronave com ID ${aeronaveId}:`, error);
        res.status(500).send('Erro ao obter assentos');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

module.exports = {
    getAssentosDisponiveis,
    getAssentoId,
    getAssentosByAeronaveId,
    reservarAssento
};

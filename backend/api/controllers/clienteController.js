const oracledb = require('oracledb');
const db = require('../db.js'); // Ajuste o caminho conforme necessário

// Função para listar todos os clientes
async function getAllClientes(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(
            `SELECT * FROM Clientes`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).send('Erro ao obter clientes');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para obter um cliente específico pelo ID
async function getClienteById(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(
            `SELECT * FROM Clientes WHERE ClienteID = :id`,
            [id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Cliente não encontrado');
        }
    } catch (error) {
        console.error(`Erro ao obter o cliente com ID ${id}:`, error);
        res.status(500).send('Erro ao obter cliente');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para criar um novo cliente
async function createCliente(req, res) {
    let connection;
    const { Nome, Email } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `INSERT INTO Clientes (Nome, Email) VALUES (:Nome, :Email)`;
        await connection.execute(sql, [Nome, Email], { autoCommit: true });
        res.status(201).json({ message: 'Cliente criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ message: 'Erro ao criar cliente' });
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para atualizar um cliente existente
async function updateCliente(req, res) {
    let connection;
    const { id } = req.params;
    const { Nome, Email } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `UPDATE Clientes SET Nome = :Nome, Email = :Email WHERE ClienteID = :id`;
        const result = await connection.execute(sql, [Nome, Email, id], { autoCommit: true });
        if (result.rowsAffected === 0) {
            res.status(404).send('Cliente não encontrado ou não alterado');
        } else {
            res.json({ message: 'Cliente atualizado com sucesso' });
        }
    } catch (error) {
        console.error(`Erro ao atualizar o cliente com ID ${id}:`, error);
        res.status(500).send('Erro ao atualizar cliente');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

// Função para remover um cliente
async function deleteCliente(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const sql = `DELETE FROM Clientes WHERE ClienteID = :id`;
        const result = await connection.execute(sql, [id], { autoCommit: true });
        if (result.rowsAffected === 0) {
            res.status(404).send('Cliente não encontrado');
        } else {
            res.json({ message: 'Cliente removido com sucesso' });
        }
    } catch (error) {
        console.error(`Erro ao deletar o cliente com ID ${id}:`, error);
        res.status(500).send('Erro ao deletar cliente');
    } finally {
        if (connection) {
            await db.closeConnection(connection);
        }
    }
}

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};

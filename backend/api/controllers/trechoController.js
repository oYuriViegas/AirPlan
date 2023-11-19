// Importar o módulo oracledb e as funções de conexão
const oracledb = require('oracledb');
const db = require('../db.js'); // Ajuste o caminho conforme sua estrutura de diretório

// Função para listar todos os trechos
async function getAllTrechos(req, res) {
    let connection;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(`SELECT * FROM Trechos`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao obter trechos', error);
        res.status(500).send('Erro ao obter trechos');
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

// Função para obter um único trecho pelo ID
async function getTrechoById(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const result = await connection.execute(`SELECT * FROM Trechos WHERE TrechoID = :id`, [id], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Trecho não encontrado');
        }
    } catch (error) {
        console.error(`Erro ao obter o trecho com ID ${id}`, error);
        res.status(500).send('Erro ao obter trecho');
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

// Função para adicionar um novo trecho
async function createTrecho(req, res) {
    let connection;
    const { origemId, destinoId } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `INSERT INTO Trechos (OrigemID, DestinoID) VALUES (:origemId, :destinoId)`;
        await connection.execute(sql, [origemId, destinoId], { autoCommit: true });
        res.status(201).json({ message: 'Trecho criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar trecho', error);
        res.status(500).json({ message: 'Erro ao criar trecho' });
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

// Função para atualizar um trecho existente
async function updateTrecho(req, res) {
    let connection;
    const { id } = req.params;
    const { origemId, destinoId } = req.body;
    try {
        connection = await db.openConnection();
        const sql = `UPDATE Trechos SET OrigemID = :origemId, DestinoID = :destinoId WHERE TrechoID = :id`;
        const result = await connection.execute(sql, [origemId, destinoId, id], { autoCommit: true });
        if (result.rowsAffected === 0) {
            res.status(404).send('Trecho não encontrado ou não alterado');
        } else {
            res.json({ message: 'Trecho atualizado com sucesso' });
        }
    } catch (error) {
        console.error(`Erro ao atualizar o trecho com ID ${id}`, error);
        res.status(500).send('Erro ao atualizar trecho');
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

// Função para remover um trecho
async function deleteTrecho(req, res) {
    let connection;
    const { id } = req.params;
    try {
        connection = await db.openConnection();
        const sql = `DELETE FROM Trechos WHERE TrechoID = :id`;
        const result = await connection.execute(sql, [id], { autoCommit: true });
        if (result.rowsAffected === 0) {
            res.status(404).send('Trecho não encontrado');
        } else {
            res.json({ message: 'Trecho removido com sucesso' });
        }
    } catch (error) {
        console.error(`Erro ao deletar o trecho com ID ${id}`, error);
        res.status(500).send('Erro ao deletar trecho');
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
    getAllTrechos,
    getTrechoById,
    createTrecho,
    updateTrecho,
    deleteTrecho
};

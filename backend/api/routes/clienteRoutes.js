const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rota para listar todos os clientes
router.get('/', clienteController.getAllClientes);

// Rota para obter um cliente específico pelo ID
router.get('/:id', clienteController.getClienteById);

// Rota para criar um novo cliente
router.post('/', clienteController.createCliente);

// Rota para atualizar um cliente existente
router.put('/:id', clienteController.updateCliente);

// Rota para remover um cliente
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;

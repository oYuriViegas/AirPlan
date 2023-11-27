const express = require('express');
const assentoController = require('../controllers/assentoController');
const router = express.Router();

// Rota para listar assentos disponíveis para um voo específico
router.get('/disponiveis/:aeronaveId/:vooId', assentoController.getAssentosDisponiveis);

// Rota para buscar o ID de um assento específico
router.get('/:aeronaveId/:codigoAssento', assentoController.getAssentoId);

// Rota para obter assentos por ID da aeronave
router.get('/aeronave/:aeronaveId', assentoController.getAssentosByAeronaveId);

// Rota para reservar um assento
router.post('/reservar', assentoController.reservarAssento);

module.exports = router;

const express = require('express');
const assentoController = require('../controllers/assentoController');
const router = express.Router();

// Rota para listar assentos disponíveis para um voo específico
router.get('/disponiveis/:aeronaveId/:vooId', assentoController.getAssentosDisponiveis);

// Rota para reservar um assento
router.post('/reservar', assentoController.reservarAssento);

module.exports = router;

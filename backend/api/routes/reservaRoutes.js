const express = require('express');
const reservaController = require('../controllers/reservaController');

const router = express.Router();

// Rota para listar todas as reservas
router.get('/', reservaController.getAllReservas);

// Rota para criar uma nova reserva
router.post('/', reservaController.createReserva);

// Rota para obter uma reserva específica pelo ID
router.get('/:id', reservaController.getReservaById);

// Rota para atualizar uma reserva pelo ID
router.put('/:id', reservaController.updateReserva);

// Rota para deletar uma reserva pelo ID
router.delete('/:id', reservaController.deleteReserva);

module.exports = router;

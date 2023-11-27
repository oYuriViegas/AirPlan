const express = require('express');
const vooController = require('../controllers/vooController'); // Ajuste o caminho conforme necessário
const router = express.Router();

// Rota para buscar todos os voos
router.get('/', vooController.getAllVoos);

router.get('/detalhes', vooController.getVoosComDetalhes);

// Rota para buscar um voo específico pelo ID
router.get('/:id', vooController.getVooById);

// Rota para obter assentos reservados de um voo específico
router.get('/:vooId/assentosReservados', vooController.getAssentosReservadosVoo);

// Rota para criar um novo voo
router.post('/', vooController.createVoo);

// Rota para atualizar um voo existente
router.put('/:id', vooController.updateVoo);

// Rota para deletar um voo
router.delete('/:id', vooController.deleteVoo);

module.exports = router;

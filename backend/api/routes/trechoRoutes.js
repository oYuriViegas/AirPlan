const express = require('express');
const trechoController = require('../controllers/trechoController'); // Certifique-se de que este caminho esteja correto
const router = express.Router();

// Rota para buscar todos os trechos
router.get('/', trechoController.getAllTrechos);

// Rota para buscar um trecho específico pelo ID
router.get('/:id', trechoController.getTrechoById);

// Rota para criar um novo trecho
router.post('/', trechoController.createTrecho);

// Rota para atualizar um trecho existente
router.put('/:id', trechoController.updateTrecho);

// Rota para deletar um trecho
router.delete('/:id', trechoController.deleteTrecho);

module.exports = router;

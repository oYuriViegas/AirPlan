const express = require('express');
const router = express.Router();
const aeroportoController = require('../controllers/aeroportoController');

// Rota para listar todos os aeroportos
router.get('/', aeroportoController.getAllAeroportos);

// Rota para obter um único aeroporto pelo ID
router.get('/:id', aeroportoController.getAeroportoById);

// Rota para criar um novo aeroporto
router.post('/', aeroportoController.createAeroporto);

// Rota para atualizar um aeroporto existente
router.put('/:id', aeroportoController.updateAeroporto);

// Rota para excluir um aeroporto
router.delete('/:id', aeroportoController.deleteAeroporto);

module.exports = router;

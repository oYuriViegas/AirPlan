const express = require('express');
const cidadeController = require('../controllers/cidadeController');
const router = express.Router(); // Criar um novo roteador

// Rota para obter todas as cidades
// Quando um GET request é feito para /cidades, a função getAllCidades do controller é chamada
router.get('/', cidadeController.getAllCidades);

// Rota para obter uma única cidade pelo ID
// Quando um GET request é feito para /cidades/:id, a função getCidadeById do controller é chamada
router.get('/:id', cidadeController.getCidadeById);

// Rota para criar uma nova cidade
// Quando um POST request é feito para /cidades, a função createCidade do controller é chamada
router.post('/', cidadeController.createCidade);

// Rota para atualizar uma cidade existente pelo ID
// Quando um PUT request é feito para /cidades/:id, a função updateCidade do controller é chamada
router.put('/:id', cidadeController.updateCidade);

// Rota para excluir uma cidade pelo ID
// Quando um DELETE request é feito para /cidades/:id, a função deleteCidade do controller é chamada
router.delete('/:id', cidadeController.deleteCidade);

module.exports = router; // Exporta o roteador para ser utilizado pelo servidor principal

// consultaVooRouter.js
const express = require('express');
const consultaVooController = require('../controllers/consultaVooController');

const router = express.Router();

router.get('/buscar', consultaVooController.getVoosPorCidade);

module.exports = router;

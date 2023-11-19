const express = require('express');
const router = express.Router();
const aeronaveController = require('../controllers/aeronaveController');

router.get('/', aeronaveController.getAllAeronaves);
router.get('/:id', aeronaveController.getAeronaveById);
router.post('/', aeronaveController.createAeronave);
router.put('/:id', aeronaveController.updateAeronave);
router.delete('/:id', aeronaveController.deleteAeronave);

module.exports = router;

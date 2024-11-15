//URL BASE: /api/noticias
const express = require('express');
const { getNoticiaPorId } = require('../../controllers/noticias.controller');
const enrutador = express.Router();

enrutador.get('/:id', getNoticiaPorId);

module.exports = enrutador;
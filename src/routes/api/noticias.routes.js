//URL BASE: /api/noticias
const express = require('express');
const { getNoticiaPorId, getNoticiasDeUsuario, getNoticiasPorQueryParams, postNoticia, putNoticia, deleteNoticia, getUltimasNoticias } = require('../../controllers/noticias.controller');
const { validarExisteEmail, validarToken } = require('../../utils/middelwares.js');
const enrutador = express.Router();

enrutador.get('/', getNoticiasPorQueryParams);
enrutador.get('/ultimas', getUltimasNoticias);
enrutador.get('/usuario', validarToken, getNoticiasDeUsuario);
enrutador.get('/:id', getNoticiaPorId);

enrutador.post('/', validarToken, postNoticia);
enrutador.put('/:id', validarToken, putNoticia);
enrutador.delete('/:id', validarToken, deleteNoticia);

module.exports = enrutador;
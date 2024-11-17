//URL BASE: /api/noticias
const express = require('express');
const { getNoticiaPorId, getNoticiasDeUsuario, getNoticiasPorSeccionCategoria, postNoticia, putNoticia, deleteNoticia } = require('../../controllers/noticias.controller');
const { validarExisteEmail, validarToken } = require('../../utils/middelwares.js');
const enrutador = express.Router();

enrutador.get('/', getNoticiasPorSeccionCategoria);
enrutador.get('/usuarios/:idUsuario', getNoticiasDeUsuario);
enrutador.get('/:id', getNoticiaPorId);

enrutador.post('/', validarToken, postNoticia);
enrutador.put('/:id', validarToken, putNoticia);
enrutador.delete('/:id', validarToken, deleteNoticia);

module.exports = enrutador;
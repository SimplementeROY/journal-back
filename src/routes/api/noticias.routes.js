//URL BASE: /api/noticias
const express = require('express');
const { getNoticiaPorId, getNoticiasDeUsuario, getNoticiasPorSeccionCategoria, postNoticia, putNoticia, deleteNoticia } = require('../../controllers/noticias.controller');
const enrutador = express.Router();

enrutador.get('/', getNoticiasPorSeccionCategoria);
enrutador.get('/usuarios/:idUsuario', getNoticiasDeUsuario);
enrutador.get('/:id', getNoticiaPorId);

enrutador.post('/', postNoticia);
enrutador.put('/:id', putNoticia);
enrutador.delete('/:id', deleteNoticia);

module.exports = enrutador;
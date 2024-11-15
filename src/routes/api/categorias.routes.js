//URL BASE: /api/categorias
const express = require('express');
const enrutador = express.Router();

const controllerCategorias = require("../../controllers/categorias.controller.js");

enrutador.get("/", controllerCategorias.verTodasCategorias);
enrutador.get("/:id", controllerCategorias.verUnaCategoriaPorId);

module.exports = enrutador;
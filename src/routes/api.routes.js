//URL BASE: /api
const express = require('express');
const enrutador = express.Router();

enrutador.use("/usuarios", require("./api/usuarios.routes.js"));
enrutador.use("/categorias", require("./api/categorias.routes.js"));
enrutador.use("/noticias", require("./api/noticias.routes.js"));

module.exports = enrutador;
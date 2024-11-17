//URL BASE: /api
const express = require('express');
const { validarToken, validarFormatoEmail, validarExisteEmail } = require('../utils/middelwares.js');
const enrutador = express.Router();

enrutador.use("/usuarios", validarToken, require("./api/usuarios.routes.js"));
enrutador.use("/categorias", require("./api/categorias.routes.js"));
enrutador.use("/noticias", require("./api/noticias.routes.js"));
enrutador.use("/suscriptores", require("./api/suscriptores.routes.js"));

module.exports = enrutador;
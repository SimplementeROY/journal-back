//URL BASE: /api/suscriptores

const express = require('express');
const enrutador = express.Router();

const { validarExisteEmailSuscriptor } = require('../../utils/middelwares.js');

// enrutador.get("/", getUsuarios);
// enrutador.get("/:id", getUsuarioPorId);

// enrutador.post("/", validarExisteEmailSuscriptor, registrarUsuario);

// enrutador.put("/:id", actualizarUsuario);

// enrutador.delete("/:id", eliminarUsuario);

module.exports = enrutador;
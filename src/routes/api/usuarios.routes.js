//URL BASE: /api/usuarios

const express = require('express');
const enrutador = express.Router();
const { getUsuarios, registrarUsuario, actualizarUsuario, eliminarUsuario, getUsuarioPorId, loginUsuario } = require("../../controllers/usuarios.controller.js");
const { validarExisteEmailUsuario } = require('../../utils/middelwares.js');

enrutador.get("/", getUsuarios);
enrutador.get("/:id", getUsuarioPorId);

enrutador.post("/", validarExisteEmailUsuario, registrarUsuario);
enrutador.post("/login", loginUsuario);

enrutador.put("/:id", actualizarUsuario);

enrutador.delete("/:id", eliminarUsuario);

module.exports = enrutador;
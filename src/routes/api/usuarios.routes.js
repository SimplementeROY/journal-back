//URL BASE: /api/usuarios

const express = require('express');
const enrutador = express.Router();
const { getUsuarios, registrarUsuario, actualizarUsuario, eliminarUsuario, getUsuarioPorId, loginUsuario, getUsuariosEditores } = require("../../controllers/usuarios.controller.js");
const { validarExisteEmailUsuario, validarToken } = require('../../utils/middelwares.js');

enrutador.get("/editores", validarToken, getUsuariosEditores);
enrutador.get("/", validarToken, getUsuarios);
enrutador.get("/:id", validarToken, getUsuarioPorId);

enrutador.post("/", validarToken, validarExisteEmailUsuario, registrarUsuario);
enrutador.post("/login", loginUsuario);

enrutador.put("/:id", validarToken, actualizarUsuario);

enrutador.delete("/:id", validarToken, eliminarUsuario);

module.exports = enrutador;
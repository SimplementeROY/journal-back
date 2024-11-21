//URL BASE: /api/suscriptores

const express = require('express');
const enrutador = express.Router();
const { bajaSuscriptor, getSuscriptores, registrarSuscriptor, actualizarSuscriptor, activarSuscriptor, eliminarSuscriptorPorId, eliminarSuscriptorPorEmail, getSuscriptorPorId, getSuscriptorPorEmail } = require("../../controllers/suscriptores.controller.js");
const { validarExisteEmailSuscriptor, validarTokenSuscriptor } = require('../../utils/middelwares.js');

enrutador.get("/activar/:id/:activo", validarTokenSuscriptor, activarSuscriptor);
enrutador.get("/", getSuscriptores);
enrutador.get("/email/:email", getSuscriptorPorEmail);
enrutador.get("/:id", getSuscriptorPorId);
enrutador.get("/baja/:email", bajaSuscriptor);

enrutador.post("/", validarExisteEmailSuscriptor, registrarSuscriptor);

enrutador.put("/:id", actualizarSuscriptor);

enrutador.delete("/:id", eliminarSuscriptorPorId);
enrutador.delete("/email/:email", validarTokenSuscriptor, eliminarSuscriptorPorEmail);

module.exports = enrutador;
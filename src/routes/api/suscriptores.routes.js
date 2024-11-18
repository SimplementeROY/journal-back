//URL BASE: /api/suscriptores

const express = require('express');
const enrutador = express.Router();
const { getSuscriptores, registrarSuscriptor, actualizarSuscriptor, eliminarSuscriptor, getSuscriptorPorId, getSuscriptorPorEmail } = require("../../controllers/suscriptores.controller.js");
const { validarExisteEmailSuscriptor } = require('../../utils/middelwares.js');

enrutador.get("/", getSuscriptores);
enrutador.get("/email/:email", getSuscriptorPorEmail);
enrutador.get("/:id", getSuscriptorPorId);

enrutador.post("/", validarExisteEmailSuscriptor, registrarSuscriptor);

enrutador.put("/:id", actualizarSuscriptor);

enrutador.delete("/:id", eliminarSuscriptor);

module.exports = enrutador;
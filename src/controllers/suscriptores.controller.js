const { json } = require("express");
const bcrypt = require('bcrypt');
const { obtenerSuscriptores, insertarSuscriptor, seleccionarSuscriptorPorId, deleteSuscriptorPorId, updateSuscriptorPorId, seleccionarSuscriptorPorEmail } = require("../models/suscriptores.model.js");
const { crearToken } = require("../utils/helpers.js");

const getSuscriptores = async (req, res) => {
    const Suscriptores = await obtenerSuscriptores();
    res.json(Suscriptores);
}

const getSuscriptorPorId = async (req, res) => {
    const { id } = req.params;
    const suscriptor = await seleccionarSuscriptorPorId(id);
    res.json(suscriptor);
}

const getSuscriptorPorEmail = async (req, res) => {
    const { email } = req.params;
    const suscriptor = await seleccionarSuscriptorPorEmail(email);
    res.json(suscriptor);
}

const registrarSuscriptor = async (req, res) => {
    try {
        const { email } = req.body;
        const respuesta = await insertarSuscriptor(email);
        console.log("RESPUESA: ", respuesta);

        const nuevoInsertado = await seleccionarSuscriptorPorId(respuesta.insertId);

        res.status(201).json({
            mensaje: "Suscriptor registrado correctamente",
            suscriptor: nuevoInsertado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al registrar el Suscriptor" });
    }
}

const actualizarSuscriptor = async (req, res) => {
    try {
        const id = req.params.id;
        const email = req.body.email;
        const suscriptorFound = await seleccionarSuscriptorPorEmail(email);
        if (suscriptorFound) {
            return res.status(404).json({ mensaje: `No se puede actualizar el usuario, el correo ${email} ya está en uso por otro usuario.` });
        }
        const result = await updateSuscriptorPorId(id, email);

        if (!result[0] || result[0].affectedRows !== 1) {
            return res.status(404).json({ mensaje: 'No se ha encontrado el Suscriptor para actualizar' });
        }

        const Suscriptor = await seleccionarSuscriptorPorId(id);
        res.json({
            mensaje: "Suscriptor actualizado correctamente",
            Suscriptor
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar el Suscriptor" });
    }
}

const eliminarSuscriptor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteSuscriptorPorId(id);
        res.json({ mensaje: "Suscriptor eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al eliminar el Suscriptor" });
    }
}

module.exports = {
    getSuscriptores,
    getSuscriptorPorId,
    getSuscriptorPorEmail,
    registrarSuscriptor,
    actualizarSuscriptor,
    eliminarSuscriptor,
}
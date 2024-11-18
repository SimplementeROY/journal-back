const { obtenerSuscriptores, insertarSuscriptor, seleccionarSuscriptorPorId, deleteSuscriptorPorId, deleteSuscriptorPorEmail, updateSuscriptorPorId, seleccionarSuscriptorPorEmail, activateSuscriptorPorId } = require("../models/suscriptores.model.js");
const { enviarEmailSuscriptor } = require("../utils/email.js");

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
        const nuevoInsertado = await seleccionarSuscriptorPorId(respuesta.insertId);

        const datosEmail = {
            para: nuevoInsertado.email,
            asunto: `ALTA como suscriptor con email ${nuevoInsertado.email} en el periodico upgrade.`,
            texto: `Hola, has recivido este correo porque te has dado de ALTA como suscriptor con email <strong> ${nuevoInsertado.email} </strong> en el periodico upgrade. Para poder disfrutar de tu suscripción haz click en el siguiente enlace <a href="http://localhost:3000/api/suscriptores/activar/${nuevoInsertado.id}/1">ACTIVAR SUSCRIPCION</a>`,
            textohtml: `Hola, has recivido este correo porque te has dado de ALTA como suscriptor con email <strong> ${nuevoInsertado.email} </strong> en el periodico upgrade. Para poder disfrutar de tu suscripción haz click en el siguiente enlace <a href="http://localhost:3000/api/suscriptores/activar/${nuevoInsertado.id}/1">ACTIVAR SUSCRIPCION</a>`,
        };
        enviarEmailSuscriptor(datosEmail);

        res.status(201).json({
            mensaje: "Suscriptor registrado correctamente",
            suscriptor: nuevoInsertado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al registrar el Suscriptor" });
    }
}

const activarSuscriptor = async (req, res) => {
    const id = req.params.id;
    const activo = req.params.activo;
    try {
        const result = await activateSuscriptorPorId(activo, id);

        if (!result[0] || result[0].affectedRows !== 1) {
            return res.status(404).json({ mensaje: 'No se ha encontrado el Suscriptor para activar/desactivar' });
        }

        const suscriptor = await seleccionarSuscriptorPorId(id);

        // const datosEmail = {
        //     para: suscriptor.email,
        //     asunto: `ACTUALIZACIÓN como suscriptor con email ${suscriptor.email} en el periodico upgrade.`,
        //     texto: `Hola, has recivido este correo porque te has ACTUALIZADO tus datos como suscriptor con email ${suscriptor.email} en el periodico upgrade.`,
        //     textohtml: `<p>Hola, has recivido este correo porque te has dado de ACTUALIZADO tus datos como suscriptor con email <strong> ${suscriptor.email} </strong> en el periodico upgrade.</p>`
        // };
        // enviarEmailSuscriptor(datosEmail);

        res.json({
            mensaje: "Suscriptor activado/desactivado correctamente",
            suscriptor
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar el suscriptor" });
    }
}

const actualizarSuscriptor = async (req, res) => {
    try {
        const id = req.params.id;
        const email = req.body.email;
        const suscriptorFound = await seleccionarSuscriptorPorEmail(email);
        console.log("suscriptorfound: ", suscriptorFound);

        if (suscriptorFound && suscriptorFound.id != id) {
            return res.status(404).json({ mensaje: `No se puede actualizar el usuario, el correo ${email} ya está en uso por otro usuario.` });
        }
        const result = await updateSuscriptorPorId(id, email);

        if (!result[0] || result[0].affectedRows !== 1) {
            return res.status(404).json({ mensaje: 'No se ha encontrado el Suscriptor para actualizar' });
        }

        const suscriptor = await seleccionarSuscriptorPorId(id);

        const datosEmail = {
            para: suscriptor.email,
            asunto: `ACTUALIZACIÓN como suscriptor con email ${suscriptor.email} en el periodico upgrade.`,
            texto: `Hola, has recivido este correo porque te has ACTUALIZADO tus datos como suscriptor con email ${suscriptor.email} en el periodico upgrade.`,
            textohtml: `<p>Hola, has recivido este correo porque te has dado de ACTUALIZADO tus datos como suscriptor con email <strong> ${suscriptor.email} </strong> en el periodico upgrade.</p>`
        };
        enviarEmailSuscriptor(datosEmail);

        res.json({
            mensaje: "Suscriptor actualizado correctamente",
            suscriptor
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar el suscriptor" });
    }
}

const eliminarSuscriptorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteSuscriptorPorId(id);
        res.json({ mensaje: "Suscriptor eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al eliminar el Suscriptor" });
    }
}

const eliminarSuscriptorPorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await deleteSuscriptorPorEmail(email);

        const datosEmail = {
            para: email,
            asunto: `BAJA como suscriptor con email ${email} en el periodico upgrade.`,
            texto: `Hola, has recivido este correo porque te has dado de BAJA como suscriptor con email ${email} en el periodico upgrade.`,
            textohtml: `<p>Hola, has recivido este correo porque te has dado de BAJA como suscriptor con email <strong> ${email} </strong> en el periodico upgrade.</p>`
        };
        enviarEmailSuscriptor(datosEmail);

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
    activarSuscriptor,
    eliminarSuscriptorPorId,
    eliminarSuscriptorPorEmail
}
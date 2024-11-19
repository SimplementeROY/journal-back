const { getVariasCategorias } = require("../models/categorias.model.js");
const { obtenerSuscriptores, insertarSuscriptor, seleccionarSuscriptorPorId, deleteSuscriptorPorId, deleteSuscriptorPorEmail, updateSuscriptorPorId, seleccionarSuscriptorPorEmail, activateSuscriptorPorId, insertarSuscriptorCategorias, eliminarSuscriptorCategorias } = require("../models/suscriptores.model.js");
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
        const { email, categorias } = req.body;
        const respuesta = await insertarSuscriptor(email);
        const nuevoInsertado = await seleccionarSuscriptorPorId(respuesta.insertId);

        const insertCat = await insertarSuscriptorCategorias(respuesta.insertId, categorias);

        const categoriasNom = await getVariasCategorias(categorias);
        console.log("________________::", categoriasNom);
        let textoCategorias = "";
        for (categoria of categoriasNom) {
            textoCategorias += `<a href=http://localhost:3000/noticias/${categoria.slug}>${categoria.nombre}</a>, `;

        }
        textoCategorias = textoCategorias.slice(0, -2);

        const datosEmail = {
            para: nuevoInsertado.email,
            asunto: `ALTA como suscriptor con email ${nuevoInsertado.email} en el periodico upgrade.`,
            texto: `Hola, has recivido este correo porque te has dado de ALTA como suscriptor con email <strong> ${nuevoInsertado.email} </strong> en el periodico upgrade. Para confirmar la suscripción haz click en el siguiente enlace <a href="http://localhost:3000/api/suscriptores/activar/${nuevoInsertado.id}/1">ACTIVAR SUSCRIPCION</a>`,
            textohtml: `<p>Hola, has recivido este correo porque te has dado de ALTA como suscriptor con email <strong> ${nuevoInsertado.email} </strong> en el periodico upgrade.</p>
            <p>Categorias en las que te has dado de alta: ${textoCategorias}.</p>
            <p>Para confirmar la suscripción haz click en el siguiente enlace <a href="http://localhost:3000/api/suscriptores/activar/${nuevoInsertado.id}/1">ACTIVAR SUSCRIPCION</a></p>`,
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

        res.json({ mensaje: "Suscriptor activado/desactivado correctamente", });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al activar el suscriptor" });
    }
}

const actualizarSuscriptor = async (req, res) => {
    try {
        const id = req.params.id;
        const { email, categorias } = req.body;
        const suscriptorFound = await seleccionarSuscriptorPorEmail(email);
        console.log("_________________Email, categorias: ", email, categorias);

        if (suscriptorFound && suscriptorFound.id != id) {
            return res.status(404).json({ mensaje: `No se puede actualizar el usuario, el correo ${email} ya está en uso por otro usuario.` });
        }
        const result = await updateSuscriptorPorId(id, email);

        if (!result[0] || result[0].affectedRows !== 1) {
            return res.status(404).json({ mensaje: 'No se ha encontrado el Suscriptor para actualizar' });
        }

        const suscriptor = await seleccionarSuscriptorPorId(id);
        const resultSC = await eliminarSuscriptorCategorias(id);
        const insertCat = await insertarSuscriptorCategorias(id, categorias);
        const datosEmail = {
            para: suscriptor.email,
            asunto: `ACTUALIZACIÓN como suscriptor con email ${suscriptor.email} en el periodico upgrade.`,
            texto: `Hola, has recivido este correo porque has ACTUALIZADO tus datos como suscriptor con email ${suscriptor.email} en el periodico upgrade.`,
            textohtml: `<p>Hola, has recivido este correo porque has ACTUALIZADO tus datos como suscriptor con email <strong> ${suscriptor.email} </strong> en el periodico upgrade.</p>`
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
        const resultSC = await eliminarSuscriptorCategorias(id);
        const resultS = await deleteSuscriptorPorId(id);
        res.json({ mensaje: "Suscriptor eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al eliminar el Suscriptor" });
    }
}

const eliminarSuscriptorPorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const suscriptor = await seleccionarSuscriptorPorEmail(email);
        const resultSC = await eliminarSuscriptorCategorias(suscriptor.id);
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
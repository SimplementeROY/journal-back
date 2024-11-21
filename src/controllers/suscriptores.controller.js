const tokenator = require("jsonwebtoken");


const { getVariasCategorias } = require("../models/categorias.model.js");
const { obtenerSuscriptores, insertarSuscriptor, seleccionarSuscriptorPorId, deleteSuscriptorPorId,
    deleteSuscriptorPorEmail, updateSuscriptorPorId, seleccionarSuscriptorPorEmail,
    activateSuscriptorPorId } = require("../models/suscriptores.model.js");
const { enviarEmailSuscriptor } = require("../utils/email.js");
const { insertarSuscriptorCategorias, eliminarSuscriptorCategorias } = require("../models/suscriptores_categoria.model.js");
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
        const { email, categorias } = req.body;
        const respuesta = await insertarSuscriptor(email);

        //_______________________________insertamos suscriptor Y DESPUES insertamos las lineas de tabla suscriptor_categorias (tantas como categorias se ha suscrito)
        const nuevoInsertado = await seleccionarSuscriptorPorId(respuesta.insertId);
        const insertCat = await insertarSuscriptorCategorias(respuesta.insertId, categorias);

        //_______________________________Llamar a categorias para generar string de categorias suscritas con sus correspondientes URLs
        const categoriasNom = await getVariasCategorias(categorias);
        let textoCategorias = "";
        for (categoria of categoriasNom) {
            textoCategorias += `<a href=http://localhost:4200/noticias/${categoria.slug}>${categoria.nombre}</a>, `;

        }
        textoCategorias = textoCategorias.slice(0, -2);

        //_______________________________Crear token para asegurar la activación de la suscripcion cuando click en el enlace ACTIVAR en el mail 
        nuevoInsertado.nombre = "suscriptor"; //estas dos lineas se han creado para REUTILIZAR la funcion crearToken ya que pide un objeto con id, email, nombre y rol
        nuevoInsertado.rol = "suscriptor";
        const tokenSuscriptor = crearToken(nuevoInsertado);

        //_______________________________Crear email de alta y enviarlo
        const datosEmail = {
            para: nuevoInsertado.email,
            asunto: `ALTA como suscriptor con email ${nuevoInsertado.email} en el periodico upgrade.`,
            texto: `Has recibido este correo porque te has dado de ALTA como suscriptor con email <strong>${nuevoInsertado.email}</strong> en Upgrade Journal. Para confirmar la suscripción, haz click en el siguiente enlace: <a href="http://localhost:3000/api/suscriptores/activar/${nuevoInsertado.id}/1">ACTIVAR SUSCRIPCION</a>`,
            textohtml: `
            <div style="background-color: lavender; padding: 5px; margin: 5px; border: 1px solid black; border-radius: 10px;">
                <h2 style="padding: 10px; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: darkblue">Upgrade Journal</h2>
                <p style="padding: 10px; font-family: Arial; font-size: 18px;">Has recibido este correo porque te has dado de ALTA como suscriptor con email <strong>${nuevoInsertado.email}</strong> en Upgrade Journal.</p>
                <p style="padding: 10px; font-family: Arial; font-size: 18px;">Categorias dadas de alta en la suscripción: ${textoCategorias}.</p>
                <p style="padding: 10px; font-family: Arial; font-size: 18px;">Para confirmar la suscripción, haz click en el siguiente enlace:
                <div style="display: flex; justify-content: center; align-items: center; font-weight: 400; color: #fff; background-color: darkblue; border: 1px solid darkblue; max-width: 15.625rem; padding: 0.375rem 0.75rem; margin: 0 auto 1.25rem auto; font-size: 1rem; line-height: 1.5; border-radius: 0.25rem; transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;">
                    <a href="http://localhost:4200/activar/${nuevoInsertado.id}/1/${tokenSuscriptor}" style="text-decoration: none; color: white; padding: 10px; font-family: Arial; font-size: 18px; font-style: italic;">ACTIVAR SUSCRIPCION</a></p>
                </div>
            </div>`,
        };// ----->> OJO ---->> la linea 64 contiene /1/elTokenCreadoDesdeElBack DONDE el 1 es el valor que se le pasará al campo "activo" de la tabla suscriptores, de modo que si se le pasara un 0 lo que se haría es inactivar
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
    //const token = req.params.token;
    const id = req.params.id;
    const activo = req.params.activo;
    console.log("____________BACK activarSuscriptor: ", id, " - ", activo);

    try {
        const result = await activateSuscriptorPorId(activo, id);

        if (!result[0] || result[0].affectedRows !== 1) {
            return res.status(404).json({ mensaje: 'No se ha encontrado el Suscriptor para activar/desactivar' });
        }

        res.json({ mensaje: "Suscriptor activado/desactivado correctamente", activo: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al activar el suscriptor", activo: false });
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
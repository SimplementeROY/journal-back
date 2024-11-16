const { json } = require("express");
const modelNoticias = require("../models/noticias.model.js");
const modelUsuarios = require("../models/usuarios.model.js");
const modelCategorias = require("../models/categorias.model.js");

const getNoticiaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await modelNoticias.seleccionarNoticiaPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada en la base de datos' });
        }
        res.json(resultado);
    } catch (error) {
        next(error);
    }
}

const getNoticiasDeUsuario = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;
        const usuario = await modelUsuarios.seleccionarUsuarioPorId(idUsuario);
        if (!usuario) {
            return res.status(404).json({ message: 'El usuario no existe en la base de datos' });
        }
        const resultado = await modelNoticias.seleccionarNoticiasPorUsuario(idUsuario);
        if (resultado.length === 0) {
            return res.status(404).json({ message: 'No se han encontrado noticias en la base de datos' });
        }
        return res.json(resultado);
    } catch (error) {
        next(error);
    }
}

const getNoticiasPorSeccionCategoria = async (req, res, next) => {
    try {
        const { seccion, categoria } = req.query;
        const [idCategoria] = await modelCategorias.getIdCategoriaPorSlug(categoria);
        const resultado = await modelNoticias.seleccionarNoticiasPorSeccionCategoria(seccion, idCategoria.id);
        if (resultado.length === 0) {
            return res.status(404).json({ message: 'No se han encontrado noticias en la base de datos' });
        }
        res.json(resultado);
    } catch (error) {
        next(error);
    }
}

const postNoticia = async (req, res, next) => {
    try {
        const nuevoId = await modelNoticias.insertarNoticia(req.body);
        // Error si la inserción ha fallado
        if (nuevoId === -1) {
            return res.status(400).json({ message: 'Petición incorrecta: Los datos proporcionados son incorrectos o incompletos.' });
        }
        const nuevaNoticia = await modelNoticias.seleccionarNoticiaPorId(nuevoId);
        res.status(201).json(nuevaNoticia[0]);
    } catch (error) {
        next(error);
    }
}

const putNoticia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const affectedRows = await modelNoticias.actualizarNoticia(id, req.body);
        // Error si la modificación ha fallado
        if (affectedRows !== 1) {
            return res.status(400).json({ message: 'Petición incorrecta: Los datos proporcionados son incorrectos o incompletos.' });
        }
        // Obtenemos la noticia autualizada para añadirla a la respuesta
        const nuevaNoticia = await modelNoticias.seleccionarNoticiaPorId(id);
        res.status(200).json(nuevaNoticia);
    } catch (error) {
        next(error);
    }
}

const deleteNoticia = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Recuperamos la noticia antes de borrarla
        const noticiaBorrada = await modelNoticias.seleccionarNoticiaPorId(id);
        const affectedRows = await modelNoticias.borrarNoticia(id);
        if (affectedRows !== 1) {
            return res.status(404).json({ error: 'Petición incorrecta: El ID de la noticia no existe' });
        }
        res.status(200).json(noticiaBorrada);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getNoticiaPorId, getNoticiasDeUsuario, getNoticiasPorSeccionCategoria, postNoticia, putNoticia, deleteNoticia
};

// getNoticiasPorSeccionCategoria
// getNoticiaPorId
// getNoticiasDeUsuario

// postNoticia
// putNoticia
// deleteNoticia
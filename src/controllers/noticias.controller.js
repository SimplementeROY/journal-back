const { json } = require("express");
const modelNoticias = require("../models/noticias.model.js");
const modelUsuarios = require("../models/usuarios.model.js");
const modelCategorias = require("../models/categorias.model.js");
const { fechaAHoraLocal } = require("../utils/helpers.js");

const getNoticiaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await modelNoticias.seleccionarNoticiaPorId(id);
        return procesarResultadoUnico(resultado, res, 'Noticia no encontrada en la base de datos');
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
        return procesarResultadoArray(resultado, res, 'No se han encontrado noticias en la base de datos');
    } catch (error) {
        next(error);
    }
}

const getNoticiasPorQueryParams = async (req, res, next) => {
    try {
        const { seccion, categoria, slug } = req.query;
        if (seccion && categoria) {
            const [idCategoria] = await modelCategorias.getIdCategoriaPorSlug(categoria);
            const resultado = await modelNoticias.seleccionarNoticiasPorSeccionCategoria(seccion, idCategoria.id);
            return procesarResultadoArray(resultado, res, 'No se han encontrado noticias en la base de datos');
        } else if (seccion) {
            const resultado = await modelNoticias.seleccionarNoticiasPorSeccion(seccion);
            return procesarResultadoArray(resultado, res, 'No se han encontrado noticias en la base de datos');
        } else if (slug) {
            const resultado = await modelNoticias.seleccionarNoticiaPorSlug(slug);
            return procesarResultadoUnico(resultado, res, 'No se ha encontrado la noticia en la base de datos');
        } else {
            res.status(400).json({ message: 'Error en la petición' });
        }
    } catch (error) {
        next(error);
    }
}

const postNoticia = async (req, res, next) => {
    try {
        // Comprobamos si ya existe el slug
        const existeSlug = await modelNoticias.seleccionarNoticiaPorSlug(req.body.slug);
        if (!existeSlug) {
            const nuevoId = await modelNoticias.insertarNoticia(req.body);
            // Error si la inserción ha fallado
            if (nuevoId === -1) {
                return res.status(400).json({ message: 'Petición incorrecta: Los datos proporcionados son incorrectos o incompletos.' });
            }
            const nuevaNoticia = await modelNoticias.seleccionarNoticiaPorId(nuevoId);
            // Ajustamos la fecha a hora local
            const nuevaNoticiaAjustada = fechaAHoraLocal(nuevaNoticia);

            // Envío de email, sacar a otra función
            const categoriaId = nuevaNoticiaAjustada[0].categoria_id;
            

            return res.status(201).json(nuevaNoticiaAjustada[0]);
        } else {
            res.status(400).json({ message: 'Error: el slug utilizado ya existe en la base de datos' });
        }
    } catch (error) {
        next(error);
    }
}

const putNoticia = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Comprobamos si ya existe el slug
        const existeSlug = await modelNoticias.seleccionarNoticiaPorSlug(req.body.slug);
        if (!existeSlug || existeSlug[0].id == id) {
            const affectedRows = await modelNoticias.actualizarNoticia(id, req.body);
            // Error si la modificación ha fallado
            if (affectedRows !== 1) {
                return res.status(400).json({ message: 'Petición incorrecta: Los datos proporcionados son incorrectos o incompletos.' });
            }
            // Obtenemos la noticia autualizada para añadirla a la respuesta
            const nuevaNoticia = await modelNoticias.seleccionarNoticiaPorId(id);
            // Ajustamos la fecha a hora local
            const nuevaNoticiaAjustada = fechaAHoraLocal(nuevaNoticia);
            return res.status(200).json(nuevaNoticiaAjustada);
        } else {
            res.status(400).json({ message: 'Error: el slug utilizado ya existe en la base de datos' });
        }
    } catch (error) {
        next(error);
    }
}

const deleteNoticia = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Recuperamos la noticia antes de borrarla
        const noticiaBorrada = await modelNoticias.seleccionarNoticiaPorId(id);
        // Ajustamos la fecha a hora local
        const noticiaBorradaAjustada = fechaAHoraLocal(noticiaBorrada);
        const affectedRows = await modelNoticias.borrarNoticia(id);
        if (affectedRows !== 1) {
            return res.status(404).json({ error: 'Petición incorrecta: El ID de la noticia no existe' });
        }
        res.status(200).json(noticiaBorradaAjustada);
    } catch (error) {
        next(error);
    }
}

const procesarResultadoArray = (resultado, res, mensajeError) => {
    // Ajustamos la fecha a hora local
    const resultadoAjustado = fechaAHoraLocal(resultado);
    if (resultadoAjustado.length === 0) {
        return res.status(404).json({ message: mensajeError });
    }
    return res.json(resultadoAjustado);
};

const procesarResultadoUnico = (resultado, res, mensajeError) => {
    if (!resultado || resultado.length === 0) {
        return res.status(404).json({ message: mensajeError });
    }
    // Ajustamos la fecha a hora local
    const resultadoAjustado = fechaAHoraLocal(resultado);
    return res.json(resultadoAjustado[0]);
};

module.exports = {
    getNoticiaPorId, getNoticiasDeUsuario, getNoticiasPorQueryParams, postNoticia, putNoticia, deleteNoticia
};

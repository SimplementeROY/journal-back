const { json } = require("express");
const modelNoticias = require("../models/noticias.model.js");
const modelUsuarios = require("../models/usuarios.model.js");
const modelCategorias = require("../models/categorias.model.js");
const { fechaAHoraLocal, enviarEmailNuevaNoticia } = require("../utils/helpers.js");

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
        // Obtenemos el usuario de la petición, que fue incrustado al validar el token
        const { usuarioIncrustado } = req;
        const page = Number(req.query.page) || 1;

        const numeroNoticias = Number(req.query.num) || 10;
        const baseUrl = `https://${req.get('host')}/api/noticias${req.path}`;


        const { resultado, total } = await modelNoticias.seleccionarNoticiasPorUsuario(usuarioIncrustado.id, page, numeroNoticias);
        console.log(total);
        return procesarResultadoArrayPaginado(resultado, res, 'No se han encontrado noticias en la base de datos', page, baseUrl, total, numeroNoticias);
    } catch (error) {
        next(error);
    }
}

const getNoticiasPorQueryParams = async (req, res, next) => {
    try {
        const { seccion, categoria, slug } = req.query;
        const num = Number(req.query.num);
        // Si num es NaN, el valor es 10 por defecto
        const numeroNoticias = isNaN(num) ? 10 : Math.abs(num);
        if (seccion && categoria) {
            const [idCategoria] = await modelCategorias.getIdCategoriaPorSlug(categoria);
            const resultado = await modelNoticias.seleccionarNoticiasPorSeccionCategoria(seccion, idCategoria.id, numeroNoticias);
            return procesarResultadoArray(resultado, res, 'No se han encontrado noticias en la base de datos');
        } else if (seccion) {
            const resultado = await modelNoticias.seleccionarNoticiasPorSeccion(seccion, numeroNoticias);
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

const getUltimasNoticias = async (req, res, next) => {
    try {
        const num = Number(req.query.num);
        // Si num es NaN, el valor es 10 por defecto
        const numeroNoticias = isNaN(num) ? 10 : Math.abs(num);
        const resultado = await modelNoticias.seleccionarUltimasNoticias(numeroNoticias);
        return procesarResultadoArray(resultado, res, 'No se han encontrado noticias en la base de datos');
    } catch (error) {
        next(error);
    }
}

const getNoticiasPorBusqueda = async (req, res, next) => {
    const { busqueda } = req.params;
    const page = Number(req.query.page) || 1;

    const numeroNoticias = Number(req.query.num) || 10;

    const palabras = busqueda.split('&').map(palabra => `%${palabra.trim()}%`);
    const condiciones = palabras.map(() => '(titular like ? or texto like ?)').join(' and ');
    try {
        const { resultado, total } = await modelNoticias.seleccionarNoticiasPorBusqueda(condiciones, palabras, numeroNoticias, page);

        const baseUrl = `${req.protocol}://${req.get('host')}/api/noticias${req.path}`;
        console.log(baseUrl);

        return procesarResultadoArrayPaginado(resultado, res, 'No existen noticias en la base de datos que contengan los términos de búsqueda proporcionados', page, baseUrl, total, numeroNoticias);
    } catch (error) {
        next(error);
    }
}

const postNoticia = async (req, res, next) => {
    try {
        // Comprobamos si ya existe el slug
        const existeSlug = await modelNoticias.seleccionarNoticiaPorSlug(req.body.slug);
        if (!existeSlug[0]) {
            const nuevoId = await modelNoticias.insertarNoticia(req.body);
            // Error si la inserción ha fallado
            if (nuevoId === -1) {
                return res.status(400).json({ message: 'Petición incorrecta: Los datos proporcionados son incorrectos o incompletos.' });
            }
            const nuevaNoticia = await modelNoticias.seleccionarNoticiaPorId(nuevoId);
            // Ajustamos la fecha a hora local
            const nuevaNoticiaAjustada = fechaAHoraLocal(nuevaNoticia);

            // Envío de email a los suscriptores de la categoría de la nueva noticia si está publicada
            if (nuevaNoticiaAjustada[0].estado === 'publicado') {
                enviarEmailNuevaNoticia(nuevaNoticiaAjustada[0]);
            }

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
        if (!existeSlug[0] || existeSlug[0].id == id) {
            const affectedRows = await modelNoticias.actualizarNoticia(id, req.body);
            // Error si la modificación ha fallado
            if (affectedRows !== 1) {
                return res.status(400).json({ message: 'Petición incorrecta: Los datos proporcionados son incorrectos o incompletos.' });
            }
            // Obtenemos la noticia autualizada para añadirla a la respuesta
            const nuevaNoticia = await modelNoticias.seleccionarNoticiaPorId(id);
            // Ajustamos la fecha a hora local
            const nuevaNoticiaAjustada = fechaAHoraLocal(nuevaNoticia);

            // Envío de email a los suscriptores de la categoría de la noticia si está publicada
            if (nuevaNoticiaAjustada[0].estado === 'publicado') {
                enviarEmailNuevaNoticia(nuevaNoticiaAjustada[0]);
            }

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

const procesarResultadoArrayPaginado = (resultado, res, mensajeError, page, url, conteo, numNoticias) => {
    const resultadoAjustado = fechaAHoraLocal(resultado);
    if (resultadoAjustado.length === 0) {
        return res.status(404).json({ message: mensajeError });
    }

    return res.json({
        resultado: resultadoAjustado,
        next: conteo > page * numNoticias ? `${url}?page=${page + 1}&num=${numNoticias}` : null, // Para el enlace a la página siguiente
        prev: page > 1 ? `${url}?page=${page - 1}&num=${numNoticias}` : null // Enlace a la página anterior o null si está en la primera página
    });
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
    getNoticiaPorId,
    getNoticiasDeUsuario,
    getNoticiasPorQueryParams,
    getUltimasNoticias,
    getNoticiasPorBusqueda,
    postNoticia,
    putNoticia,
    deleteNoticia
};

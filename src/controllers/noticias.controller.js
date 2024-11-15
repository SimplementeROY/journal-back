const { json } = require("express");
const modelNoticias = require("../models/noticias.model.js");

const getNoticiaPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await modelNoticias.seleccionarNoticiaPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada en la base de datos' });
        }
        res.json(resultado[0]);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getNoticiaPorId
};

// getNoticiasPorSeccionCategoria
// getNoticiaPorId
// getNoticiasDeUsuario

// postNoticia
// putNoticia
// deleteNoticia
const { json } = require("express");
const modelCategorias = require("../models/categorias.model.js");

// devuelve array de objetos 
const verTodasCategorias = async (peticion, respuesta, next) => {
    try {
        const resultado = await modelCategorias.getAllCategorias();
        respuesta.json(resultado);
    } catch (error) {
        next(error);
    }
}

// OJO -- > devuelve objeto, NO ARRAY con un objeto
const verUnaCategoriaPorId = async (peticion, respuesta, next) => {
    try {
        const idCategoria = peticion.params.id;
        const resultado = await modelCategorias.getUnaCategoriaPorId(idCategoria);
        if (!resultado) {
            return respuesta.status(404).json({ message: "La categoría con id " + idCategoria + " no existe." });
        }
        console.log(resultado);

        respuesta.json(resultado);
    } catch (error) {
        next("ERRORES VerUnaCategoriaPorId: ", error);
    }
}

module.exports = {
    verTodasCategorias,
    verUnaCategoriaPorId,
};
const poolSQL = require("../config/db.js");

const getAllCategorias = async () => {
    try {
        const consulta = await poolSQL.query("select * from categoria");
        return consulta[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const getVariasCategorias = async (arrCategorias) => {
    try {
        let listaCategorias = "";
        for (categoria of arrCategorias) {
            listaCategorias += " id=" + categoria + " OR";
        }
        listaCategorias = listaCategorias.slice(0, -2);
        const consulta = await poolSQL.query(`select * from categoria WHERE ${listaCategorias};`);
        return consulta[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const getUnaCategoriaPorId = async (id) => {
    try {
        const consulta = await poolSQL.query("SELECT * FROM categoria WHERE id=" + id);
        return (consulta[0].length === 0) ? null : consulta[0][0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const getIdCategoriaPorSlug = async (slug) => {
    try {
        const consulta = await poolSQL.query(
            "select id from categoria where slug = ?",
            [slug]);
        return consulta[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

module.exports = {
    getAllCategorias,
    getUnaCategoriaPorId,
    getIdCategoriaPorSlug,
    getVariasCategorias
};
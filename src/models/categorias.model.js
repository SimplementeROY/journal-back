const poolSQL = require("../config/db.js");

const getAllCategorias = async () => {
    const consulta = await poolSQL.query("select * from categoria");
    return consulta[0];
}

const getVariasCategorias = async (arrCategorias) => {
    let listaCategorias = "";
    for (categoria of arrCategorias) {
        listaCategorias += " id=" + categoria + " OR";
    }
    listaCategorias = listaCategorias.slice(0, -2);
    const consulta = await poolSQL.query(`select * from categoria WHERE ${listaCategorias};`);
    return consulta[0];
}

const getUnaCategoriaPorId = async (id) => {
    const consulta = await poolSQL.query("SELECT * FROM categoria WHERE id=" + id);
    return (consulta[0].length === 0) ? null : consulta[0][0];
}

const getIdCategoriaPorSlug = async (slug) => {
    const consulta = await poolSQL.query(
        "select id from categoria where slug = ?",
        [slug]);
    return consulta[0];
}

module.exports = {
    getAllCategorias,
    getUnaCategoriaPorId,
    getIdCategoriaPorSlug,
    getVariasCategorias
};
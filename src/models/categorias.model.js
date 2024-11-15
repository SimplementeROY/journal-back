const poolSQL = require("../config/db.js");

const getAllCategorias = async () => {
    const consulta = await poolSQL.query("select * from categoria");
    return consulta[0];
}

const getUnaCategoriaPorId = async (id) => {
    const consulta = await poolSQL.query("SELECT * FROM categoria WHERE id=" + id);
    return (consulta[0].length === 0) ? null : consulta[0][0];
}

module.exports = {
    getAllCategorias,
    getUnaCategoriaPorId
};
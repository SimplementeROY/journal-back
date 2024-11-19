const poolSQL = require("../config/db.js");

const obtenerSuscriptoresAUnaCategoria = async (categoriaId) => {
    const [resultado] = await poolSQL.query(
        'select suscriptores_id from suscriptores_categoria where categoria_id = ?',
        [categoriaId]
    );
    return resultado;
}

module.exports = {
    obtenerSuscriptoresAUnaCategoria
};
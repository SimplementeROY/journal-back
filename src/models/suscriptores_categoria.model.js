const poolSQL = require("../config/db.js");

const obtenerSuscriptoresAUnaCategoria = async (categoria) => {
    const [resultado] = await poolSQL.query(
        'select suscriptores_id from suscriptores_categoria where categoria_id = ?',
        [categoria]
    );
    return resultado;
}

module.exports = {
    obtenerSuscriptoresAUnaCategoria
};
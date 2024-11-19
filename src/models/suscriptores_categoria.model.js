const poolSQL = require("../config/db.js");

// select suscriptores_id from suscriptores_categoria as sc join suscriptores as s on sc.suscriptores_id = s.id where sc.categoria_id = 2 and s.activo = 1
const obtenerSuscriptoresAUnaCategoria = async (categoriaId) => {
    const [resultado] = await poolSQL.query(
        'select suscriptores_id from suscriptores_categoria as sc join suscriptores as s on sc.suscriptores_id = s.id where sc.categoria_id = ? and activo = 1',
        [categoriaId]
    );
    return resultado;
}

const insertarSuscriptorCategorias = async (idSuscriptor, categorias) => {
    let bucleCategorias = "";
    for (categoria of categorias) {
        bucleCategorias += `(${idSuscriptor},${categoria}),`;
    }
    bucleCategorias = bucleCategorias.slice(0, -1);//eliminar la coma ultima sobrante
    const [resultado] = await poolSQL.query(`INSERT INTO suscriptores_categoria (suscriptores_id, categoria_id) VALUES ${bucleCategorias}`);
    return resultado;
}

const eliminarSuscriptorCategorias = (idSuscriptor) => {
    const result = poolSQL.query('DELETE FROM suscriptores_categoria WHERE suscriptores_id =?', [idSuscriptor]);
    return result;
}

module.exports = {
    obtenerSuscriptoresAUnaCategoria,
    insertarSuscriptorCategorias,
    eliminarSuscriptorCategorias
};
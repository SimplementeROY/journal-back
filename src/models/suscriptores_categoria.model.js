const poolSQL = require("../config/db.js");

// select suscriptores_id from suscriptores_categoria as sc join suscriptores as s on sc.suscriptores_id = s.id where sc.categoria_id = 2 and s.activo = 1
const obtenerSuscriptoresAUnaCategoria = async (categoriaId) => {
    try {
        const [resultado] = await poolSQL.query(
            'select suscriptores_id from suscriptores_categoria as sc join suscriptores as s on sc.suscriptores_id = s.id where sc.categoria_id = ? and activo = 1',
            [categoriaId]
        );
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const insertarSuscriptorCategorias = async (idSuscriptor, categorias) => {
    try {
        let bucleCategorias = "";
        for (categoria of categorias) {
            bucleCategorias += `(${idSuscriptor},${categoria}),`;
        }
        bucleCategorias = bucleCategorias.slice(0, -1);//eliminar la coma ultima sobrante
        const [resultado] = await poolSQL.query(`INSERT INTO suscriptores_categoria (suscriptores_id, categoria_id) VALUES ${bucleCategorias}`);
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const eliminarSuscriptorCategorias = (idSuscriptor) => {
    try {
        const result = poolSQL.query('DELETE FROM suscriptores_categoria WHERE suscriptores_id =?', [idSuscriptor]);
        return result;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

module.exports = {
    obtenerSuscriptoresAUnaCategoria,
    insertarSuscriptorCategorias,
    eliminarSuscriptorCategorias
};
const poolSQL = require("../config/db.js");

const seleccionarNoticiaPorId = async (id) => {
    const [resultado] = await poolSQL.query(
        'select * from noticias where id = ?', 
        [id]
    );
    return resultado;
}

module.exports = {
    seleccionarNoticiaPorId
};

// seleccionarNoticiasPorSeccionCategoria
// seleccionarNoticiaPorId
// seleccionarNoticiasDeUsuario

// insertarNoticia
// actualizarNoticia
// borrarNoticia

const poolSQL = require("../config/db.js");

const seleccionarUsuarioPorId = async (id) => {
    const [resultado] = await poolSQL.query(
        'select * from usuarios where id = ?', 
        [id]
    );
    return resultado[0];
}

module.exports = {
    seleccionarUsuarioPorId
};
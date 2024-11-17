const poolSQL = require("../config/db.js");

const obtenerSuscriptores = async () => {
    const resultado = await poolSQL.query('SELECT * FROM suscriptores');
    return resultado[0];
}

const seleccionarSuscriptorPorId = async (id) => {
    const [resultado] = await poolSQL.query(
        'SELECT * FROM suscriptores WHERE id = ?',
        [id]
    );
    return resultado[0];
}

const seleccionarSuscriptorPorEmail = async (email) => {
    const [resultado] = await poolSQL.query(
        'SELECT * FROM suscriptores WHERE email = ?',
        [email]
    );
    return resultado[0];
}

const insertarSuscriptor = async (email) => {
    const [resultado] = await poolSQL.query('INSERT INTO suscriptores (email) VALUES (?)', [nombre]);
    console.log(resultado);
    return resultado;
}

const updateSuscriptorPorId = (id, email) => {
    const result = poolSQL.query('UPDATE suscriptores SET  email=? WHERE id=?', [email, id]);
    return result;
}

const deleteSuscriptorPorId = (id) => {
    const result = poolSQL.query('DELETE FROM suscriptores WHERE id =?', [id]);
    return result;
}

module.exports = {
    seleccionarSuscriptorPorId,
    seleccionarSuscriptorPorEmail,
    obtenerSuscriptores,
    insertarSuscriptor,
    deleteSuscriptorPorId,
    updateSuscriptorPorId
};
const poolSQL = require("../config/db.js");
const { getVariasCategorias } = require("./categorias.model.js");

const obtenerSuscriptores = async () => {
    try {
        const resultado = await poolSQL.query('SELECT * FROM suscriptores');
        return resultado[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarSuscriptorPorId = async (id) => {
    try {
        const [resultado] = await poolSQL.query(
            'SELECT * FROM suscriptores WHERE id = ?',
            [id]
        );
        return resultado[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarSuscriptorPorEmail = async (email) => {//Devuelve false si no existe
    try {
        const [resultado] = await poolSQL.query(
            'SELECT * FROM suscriptores WHERE email = ?',
            [email]
        );
        return resultado[0] ? resultado[0] : false;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const insertarSuscriptor = async (email) => {
    try {
        const [resultado] = await poolSQL.query('INSERT INTO suscriptores (email) VALUES (?)', [email]);
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const updateSuscriptorPorId = (id, email) => {
    try {
        const result = poolSQL.query('UPDATE suscriptores SET email=? WHERE id=?', [email, id]);
        return result;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const activateSuscriptorPorId = (activo, id) => {
    try {
        const result = poolSQL.query('UPDATE suscriptores SET activo=? WHERE id=?', [activo, id]);
        return result;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const deleteSuscriptorPorId = (id) => {
    try {
        const result = poolSQL.query('DELETE FROM suscriptores WHERE id =?', [id]);
        return result;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const deleteSuscriptorPorEmail = (email) => {
    try {
        const result = poolSQL.query('DELETE FROM suscriptores WHERE email =?', [email]);
        return result;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

module.exports = {
    seleccionarSuscriptorPorId,
    seleccionarSuscriptorPorEmail,
    obtenerSuscriptores,
    insertarSuscriptor,
    deleteSuscriptorPorId,
    deleteSuscriptorPorEmail,
    updateSuscriptorPorId,
    activateSuscriptorPorId,
};
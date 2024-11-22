const poolSQL = require("../config/db.js");

// select * from usuarios
const obtenerUsuarios = async () => {
    try {
        const resultado = await poolSQL.query('SELECT * FROM usuarios');
        return resultado[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

// select * from usuarios where id = ?
const seleccionarUsuarioPorId = async (id) => {
    try {
        const [resultado] = await poolSQL.query(
            'SELECT * FROM usuarios WHERE id = ?',
            [id]
        );
        return resultado[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

// select * from usuarios where email = ?
const seleccionarUsuarioPorEmail = async (email) => {
    try {
        const [resultado] = await poolSQL.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return resultado[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarUsuariosEditores = async () => {
    try {
        const resultado = await poolSQL.query('select id, nombre from usuarios where rol = "editor"');
        return resultado[0];
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

// insert into usuarios (nombre, email, contraseña, rol) values (?, ?, ?, ?)
const insertarUsuario = async ({ nombre, email, contraseña, rol }) => {
    try {
        const [resultado] = await poolSQL.query(
            'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, contraseña, rol]
        );
        console.log(resultado);
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

// update usuarios set nombre=?, email=?, contraseña=?, rol=? where id=?
const updateUsuarioPorId = (usuarioId, { nombre, email, contraseña, rol }) => {
    try {
        const result = poolSQL.query('UPDATE usuarios SET nombre=?, email=?, contraseña=?, rol=? WHERE id=?', [nombre, email, contraseña, rol, usuarioId]);
        return result;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

// delete from usuarios where id = ?
const deleteUsuarioPorId = (usuarioId) => {
    try {
        const result = poolSQL.query('DELETE FROM usuarios WHERE id =?', [usuarioId]);
        return result;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

module.exports = {
    seleccionarUsuarioPorId,
    seleccionarUsuarioPorEmail,
    obtenerUsuarios,
    seleccionarUsuariosEditores,
    insertarUsuario,
    deleteUsuarioPorId,
    updateUsuarioPorId
};
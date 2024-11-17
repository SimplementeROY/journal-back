const poolSQL = require("../config/db.js");

// select * from usuarios
const obtenerUsuarios = async () => {
    const resultado = await poolSQL.query('SELECT * FROM usuarios');
    return resultado[0];
}

// select * from usuarios where id = ?
const seleccionarUsuarioPorId = async (id) => {
    const [resultado] = await poolSQL.query(
        'SELECT * FROM usuarios WHERE id = ?',
        [id]
    );
    return resultado[0];
}

// insert into usuarios (nombre, email, contraseña, rol) values (?, ?, ?, ?)
const insertarUsuario = async ({ nombre, email, contraseña, rol }) => {
    const [resultado] = await poolSQL.query(
        'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
        [nombre, email, contraseña, rol]
    );
    console.log(resultado);
    return resultado;
}

// update usuarios set nombre=?, email=?, contraseña=?, rol=? where id=?
const updateUsuarioPorId = (usuarioId, { nombre, email, contraseña, rol }) => {
    const result = poolSQL.query('UPDATE usuarios SET nombre=?, email=?, contraseña=?, rol=? WHERE id=?', [nombre, email, contraseña, rol, usuarioId]);
    return result;
}

// delete from usuarios where id = ?
const deleteUsuarioPorId = (usuarioId) => {
    const result = poolSQL.query('DELETE FROM usuarios WHERE id =?', [usuarioId]);
    return result;
}

module.exports = {
    seleccionarUsuarioPorId,
    obtenerUsuarios,
    insertarUsuario,
    deleteUsuarioPorId,
    updateUsuarioPorId
};
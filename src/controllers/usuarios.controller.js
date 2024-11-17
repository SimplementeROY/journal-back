const { json } = require("express");
const { obtenerUsuarios, insertarUsuario, seleccionarUsuarioPorId, deleteUsuarioPorId, updateUsuarioPorId } = require("../models/usuarios.model.js");

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    const usuarios = await obtenerUsuarios();
    res.json(usuarios);
}

// Obtener un usuario por id
const getUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    const usuario = await seleccionarUsuarioPorId(id);
    res.json(usuario);
}

// Registrar un usuario
const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña, rol } = req.body;
        const usuario = await insertarUsuario({ nombre, email, contraseña, rol });

        // Obtener el ID insertado del resultado
        const nuevoUsuarioId = usuario.insertId;

        // Buscar el usuario completo por su ID
        const usuarioInsertado = await seleccionarUsuarioPorId(nuevoUsuarioId);

        console.log("Usuario registrado:", usuarioInsertado);
        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: usuarioInsertado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al registrar el usuario" });
    }
}

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateUsuarioPorId(id, req.body);

        if (!result[0] || result[0].affectedRows !== 1) {
            return res.status(404).json({ mensaje: 'No se ha encontrado el usuario para actualizar' });
        }

        const usuario = await seleccionarUsuarioPorId(id);
        res.json({
            mensaje: "Usuario actualizado correctamente",
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
}

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteUsuarioPorId(id);
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al eliminar el usuario" });
    }
}

module.exports = {
    getUsuarios,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    getUsuarioPorId
}
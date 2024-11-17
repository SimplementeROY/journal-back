const { json } = require("express");
const bcrypt = require('bcrypt');
const { obtenerUsuarios, insertarUsuario, seleccionarUsuarioPorId, deleteUsuarioPorId, updateUsuarioPorId, seleccionarUsuarioPorEmail } = require("../models/usuarios.model.js");
const { crearToken } = require("../utils/helpers.js");

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
        // Encriptamos la contraseña antes de enviarla
        req.body.contraseña = await bcrypt.hash(req.body.contraseña, 10);
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

// Login de usuario
const loginUsuario = async (req, res, next) => {
    try {
        const { email, contraseña } = req.body;
        const usuario = await seleccionarUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ message: 'Email y/o password incorrectos' });
        }
        const mismoPassword = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!mismoPassword) {
            return res.status(401).json({ message: 'Email y/o password incorrectos' });
        }
        res.json({
            message: 'Bienvenido a CMS Noticias', 
            token: crearToken(usuario)
        });
    } catch (error) {
        next(error);
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
    loginUsuario,
    actualizarUsuario,
    eliminarUsuario,
    getUsuarioPorId
}
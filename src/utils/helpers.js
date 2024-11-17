const jwtokens = require("jsonwebtoken");
require('dotenv').config();

const crearToken = (usuario) => {
    const datos = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    }
    return jwtokens.sign(datos, process.env.FIRMATOKEN);
}

module.exports = {
    crearToken
}
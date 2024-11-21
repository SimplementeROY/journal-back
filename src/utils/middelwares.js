require('dotenv').config(); //libreria para traer variables de entorno
const jwtokens = require("jsonwebtoken");
const isemail = require("isemail");
const { seleccionarUsuarioPorId, seleccionarUsuarioPorEmail } = require('../models/usuarios.model');
const { seleccionarSuscriptorPorId, seleccionarSuscriptorPorEmail } = require('../models/suscriptores.model');

const validarToken = async (req, res, next) => {
    //comprobar si el token viene incluido en la cabecera Authorization
    if (!req.headers['authorization']) {
        return res.status(403).json({ mensaje: "Es necesario el token de autenticación." });
    }
    //comprobar que el token de la cabecera es igual al token generado segun los datos del usuario
    const token_cabecera = req.headers['authorization'];//cogemos el token de la cabecera
    const firmaToken = process.env.FIRMATOKEN;//cogemos la llave de la variable de entorno
    try {//OJO usamos un tryCath porque la forma de trabajar del .verify devuelve una EXCEPCION
        tokenDescifrado = jwtokens.verify(token_cabecera, firmaToken);//primer parametro el token, segundo la llave 
    } catch (error) {
        return res.status(403).json({ mensaje: "El token es incorrecto." });
    }
    //Si tenemos token y es correcto buscamos la existencia del usuario
    const usuario = await seleccionarUsuarioPorId(tokenDescifrado.id)//en el token descifrado tenemos el nombre y el id del usuario
    if (!usuario) return res.status(404).json({ mensaje: "El usuario no existe" });
    //Ahora incrusto en la peticion TODO EL USUARIO que he buscado antes, me invento una nueva propiedad en req de modo que en cualquier lugar tendré el usuario que se ha logado
    req.usuarioIncrustado = usuario; //incrusto al req el usuario entero
    next();
}

const validarTokenSuscriptor = async (req, res, next) => {
    console.log("___________BACK midelware validar token, header:", req.headers);

    if (!req.headers['authsuscriptor']) {
        console.log("___________BACK no encuentra el token");
        return res.status(403).json({ mensaje: "Es necesario el token de autenticación de suscriptor." });
    }
    const token_cabecera = req.headers['authsuscriptor'];//cogemos el token de la cabecera
    console.log("___________BACK recojo token cabecera", token_cabecera);
    const firmaToken = process.env.FIRMATOKEN;//cogemos la llave de la variable de entorno
    try {//OJO usamos un tryCath porque la forma de trabajar del .verify devuelve una EXCEPCION
        console.log("___________BACK descifra token 1");
        tokenDescifrado = jwtokens.verify(token_cabecera, firmaToken);//primer parametro el token, segundo la llave 

    } catch (error) {
        console.log("___________BACK token es incorrecto");
        return res.status(403).json({ mensaje: "El token de sucriptor es incorrecto." });
    }

    const suscriptor = await seleccionarSuscriptorPorId(tokenDescifrado.id)//en el token descifrado tenemos el nombre y el id del usuario
    if (!suscriptor) return res.status(404).json({ mensaje: "El suscriptor no existe" });
    //Ahora incrusto en la peticion TODO EL USUARIO que he buscado antes, me invento una nueva propiedad en req de modo que en cualquier lugar tendré el usuario que se ha logado
    req.suscriptorIncrustado = suscriptor; //incrusto al req el usuario entero
    next();
}

//validar el formato de email NO SE SI LO USAREMOS YA QUE LA VALIDACION SE SUPONE QUE ES EN EL FRONT
const validarFormatoEmail = async (req, res, next) => {
    const correo = req.body.email;
    //valido si el correo introducido tiene formato correcto, sino lo saco de la funcion (libreria ISEMAIL)
    if (!isemail.validate(correo)) return res.status(400).json({ mensaje: "El email " + correo + " NO tiene un formato correcto." });
    next();
}

//Evitar duplicidad de email de USUARIO en db
const validarExisteEmailUsuario = async (req, res, next) => {
    const correo = req.body.email;
    // //busco el mail en la bd , si NO existe el mail en la bd sino lo saco de la funcion
    const emailExiste = await seleccionarUsuarioPorEmail(correo);
    if (emailExiste) return res.status(404).json({ mensaje: "El email de usuario " + correo + " ya existe en la base de datos." });
    // //si no ha entrado en ningun condicional de los anteriores para adelante
    next();
}

//Evitar duplicidad de email de SUSCRIPTOR en db
const validarExisteEmailSuscriptor = async (req, res, next) => {
    const correo = req.body.email;
    // //busco el mail en la bd , si NO existe el mail en la bd sino lo saco de la funcion
    const emailExiste = await seleccionarSuscriptorPorEmail(correo);
    if (emailExiste) return res.status(404).json({ mensaje: `El email de suscriptor ${correo} ya existe en la base de datos.` });
    // //si no ha entrado en ningun condicional de los anteriores para adelante
    next();
}

module.exports = {
    validarToken,
    validarTokenSuscriptor,
    validarExisteEmailUsuario,
    validarExisteEmailSuscriptor,
    validarFormatoEmail,
}
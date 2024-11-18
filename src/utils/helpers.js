const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const jwtokens = require("jsonwebtoken");

require('dotenv').config();
dayjs.extend(utc);
dayjs.extend(timezone);

const crearToken = (usuario) => {
    const datos = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    }
    return jwtokens.sign(datos, process.env.FIRMATOKEN);
}

const fechaAHoraLocal = (fechaAntigua) => {
    // Obtenemos la zona horaria local
    const zonaHorariaLocal = dayjs.tz.guess();
    // Devolvemos la hora en zona horaria local
    const fechaNueva = fechaAntigua.map(noticia => ({
        ...noticia,
        fecha_publicacion: dayjs.utc(noticia.fecha_publicacion).tz(zonaHorariaLocal).format('YYYY-MM-DD')
    }));
    return fechaNueva;
}

module.exports = {
    crearToken,
    fechaAHoraLocal
}
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const jwtokens = require("jsonwebtoken");
const modelCategorias = require("../models/categorias.model.js");
const modelSuscriptores = require("../models/suscriptores.model.js");
const modelSuscriptoresCategorias = require("../models/suscriptores_categoria.model.js");
const { enviarEmailSuscriptor } = require("../utils/email.js");

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

const enviarEmailNuevaNoticia = async (noticia) => {
    const categoria = await modelCategorias.getUnaCategoriaPorId(noticia.categoria_id);
    const suscriptoresIds = await modelSuscriptoresCategorias.obtenerSuscriptoresAUnaCategoria(noticia.categoria_id);
    for (suscriptor of suscriptoresIds) {
        const datosSuscriptor = await modelSuscriptores.seleccionarSuscriptorPorId(suscriptor.suscriptores_id);
        const datosEmail = {
            para: datosSuscriptor.email,
            asunto: `Nueva noticia publicada en ${categoria.nombre} en Upgrade Journal.`,
            texto: `Se ha publicado una nueva noticia de la categoría ${categoria.nombre} en Upgrade Journal.`,
            textohtml: `
                <div style="background-color: lavender; padding: 5px; margin: 5px; border: 1px solid black; border-radius: 10px;">
                    <h2 style="padding: 10px; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: darkblue">Upgrade Journal</h2>
                    <p style="padding: 10px; font-family: Arial; font-size: 18px;">Se ha publicado una nueva noticia de la categoría ${categoria.nombre} en Upgrade Journal.</p>
                    <div style="padding-bottom: 20px;">
                        <a href="http://localhost:4200/noticias/${categoria.slug}/${noticia.slug}" style="text-decoration: none; color: darkblue; padding: 10px; font-family: Arial; font-size: 18px; font-style: italic">${noticia.titular}</a>
                    </div>
                    <img src="${noticia.imagen}" alt="${noticia.titular}" style="padding: 10px; padding-bottom: 30px; max-width: 80vw;">
                </div>`,
        };
        enviarEmailSuscriptor(datosEmail);
    }
}

module.exports = {
    crearToken,
    fechaAHoraLocal,
    enviarEmailNuevaNoticia
}
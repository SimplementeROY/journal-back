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

const enviarEmailNuevaNoticia = async (noticia) => { //TODO añadir enlace para la baja del suscriptor en el correo que les llega con las nuevas noticias
    const categoria = await modelCategorias.getUnaCategoriaPorId(noticia.categoria_id);
    const suscriptoresIds = await modelSuscriptoresCategorias.obtenerSuscriptoresAUnaCategoria(noticia.categoria_id);
    for (suscriptor of suscriptoresIds) {
        const datosSuscriptor = await modelSuscriptores.seleccionarSuscriptorPorId(suscriptor.suscriptores_id);
        const datosEmail = {
            para: datosSuscriptor.email,
            asunto: `Nueva noticia publicada en ${categoria.nombre} en Upgrade Journal.`,
            texto: `Se ha publicado una nueva noticia de la categoría ${categoria.nombre} en Upgrade Journal.`,
            textohtml: `<div style="background-color: white; padding: 5px; margin: 5px; border: 1px solid grey; border-radius: 10px; box-shadow: 0px 5px 5px grey; text-align: center;">
                <img src="https://journal-front-exrnk9r0f-simplementeroys-projects.vercel.app/images/upgradejournallogo.png" style="width: 150px">
                <p style="padding: 10px; font-family: Arial; font-size: 18px;">Se ha publicado una nueva noticia de la categoría ${categoria.nombre} en Upgrade Journal.</p>
                <div style="background-color: white; padding: 5px; margin: 5px; border: 1px solid grey; border-radius: 10px;">
                    <div style="padding: 20px;">
                        <a href="https://journal-front-exrnk9r0f-simplementeroys-projects.vercel.app/noticias/${categoria.slug}/${noticia.slug}" style="text-decoration: none; color: black; padding: 10px; font-family: Arial; font-size: 20px; font-style: italic; font-weight: bold;">${noticia.titular}</a>
                    </div>
                    <img src="${noticia.imagen}" alt="${noticia.titular}" style="padding: 10px; padding-bottom: 30px; max-width: 80vw;">
                </div>
                <p style="padding: 10px; font-family: Arial; font-size: 12px;">Has recibido este email porque te has dado de alta en la categoría ${categoria.nombre} de Upgrade Journal con el email ${datosSuscriptor.email}</p>
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
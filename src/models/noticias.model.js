const poolSQL = require("../config/db.js");

const seleccionarNoticiaPorId = async (id) => {
    try {
        const [resultado] = await poolSQL.query(
            'select * from noticias where id = ?',
            [id]
        );
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarNoticiasPorUsuario = async (id, page, numeroNoticias) => {
    try {
        const [resultado] = await poolSQL.query(
            `SELECT * FROM noticias WHERE redactor_id = ? OR editor_id = ? ORDER BY CASE WHEN estado = 'borrador' THEN 1 WHEN estado = 'revisión' THEN 2 WHEN estado = 'publicado' THEN 3 ELSE 4 END, fecha_publicacion DESC limit ${numeroNoticias} offset ${(page - 1) * numeroNoticias};`,
            [id, id]
        );

        const [conteo] = await poolSQL.query(
            "SELECT count(*) as total FROM noticias WHERE redactor_id = ? OR editor_id = ? ORDER BY CASE WHEN estado = 'borrador' THEN 1 WHEN estado = 'revisión' THEN 2 WHEN estado = 'publicado' THEN 3 ELSE 4 END, fecha_publicacion DESC;",
            [id, id]
        );
        return { resultado, total: conteo[0].total };
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarNoticiasPorSeccionCategoria = async (seccion, categoriaId, numeroNoticias) => {
    try {
        const [resultado] = await poolSQL.query(
            'select n.*, c.slug as slug_cat from noticias n join categoria c on n.categoria_id = c.id where n.secciones = ? and n.categoria_id = ? and n.estado = "publicado" order by n.fecha_publicacion desc limit ?',
            [seccion, categoriaId, numeroNoticias]
        );
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarNoticiasPorSeccion = async (seccion, numeroNoticias) => {
    try {
        const [resultado] = await poolSQL.query(
            'select n.*, c.slug as slug_cat from noticias n join categoria c on n.categoria_id = c.id where n.secciones = ? and n.estado = "publicado" order by n.fecha_publicacion desc limit ?',
            [seccion, numeroNoticias]
        );
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarNoticiaPorSlug = async (slug) => {
    try {
        const [resultado] = await poolSQL.query(
            'select n.*, c.slug as slug_cat from noticias n join categoria c on n.categoria_id = c.id where n.slug = ? and n.estado = "publicado" order by n.fecha_publicacion desc',
            [slug]
        );
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarUltimasNoticias = async (numeroNoticias) => {
    try {
        const [resultado] = await poolSQL.query(
            'select n.*, c.slug as slug_cat from noticias n join categoria c on n.categoria_id = c.id where n.estado = "publicado" order by n.fecha_publicacion desc limit ?',
            [numeroNoticias]
        );
        return resultado;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const seleccionarNoticiasPorBusqueda = async (condiciones, palabras, numeroNoticias, page) => {
    try {
        const valores = palabras.flatMap(palabra => [palabra, palabra]);
        valores.push(numeroNoticias);
        const [resultado] = await poolSQL.query(
            `select n.*, c.slug as slug_cat from noticias n join categoria c on n.categoria_id = c.id where estado = "publicado" and ${condiciones} order by fecha_publicacion desc limit ? offset ${(page - 1) * numeroNoticias}`,
            valores
        );
        const [conteo] = await poolSQL.query(
            `select count(*) as total from noticias n join categoria c on n.categoria_id = c.id where estado = "publicado" and ${condiciones}`,
            valores
        );
        return { resultado, total: conteo[0].total };
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const insertarNoticia = async ({ titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug }) => {
    try {
        const [resultado] = await poolSQL.query(
            'insert into noticias (titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug]
        );
        if (resultado.affectedRows != 1) {
            return -1;
        }
        return resultado.insertId;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const actualizarNoticia = async (id, { titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug }) => {
    try {
        const [resultado] = await poolSQL.query(
            'update noticias set titular = ?, imagen = ?, texto = ?, secciones = ?, fecha_publicacion = ?, redactor_id = ?, editor_id = ?, categoria_id = ?, estado = ?, importancia = ?, cambios = ?, slug = ? where id = ?',
            [titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug, id]
        );
        return resultado.affectedRows;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

const borrarNoticia = async (id) => {
    try {
        const [resultado] = await poolSQL.query(
            'delete from noticias where id = ?',
            [id]
        );
        return resultado.affectedRows;
    } catch (error) {
        console.error('ERROR: ', error.message)
        throw error;
    }
}

module.exports = {
    seleccionarNoticiaPorId,
    seleccionarNoticiasPorUsuario,
    seleccionarNoticiasPorSeccionCategoria,
    seleccionarNoticiasPorSeccion,
    seleccionarNoticiaPorSlug,
    seleccionarUltimasNoticias,
    seleccionarNoticiasPorBusqueda,
    insertarNoticia,
    actualizarNoticia,
    borrarNoticia,
};

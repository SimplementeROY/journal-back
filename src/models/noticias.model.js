const poolSQL = require("../config/db.js");

const seleccionarNoticiaPorId = async (id) => {
    const [resultado] = await poolSQL.query(
        'select * from noticias where id = ?',
        [id]
    );
    return resultado[0];
}

const seleccionarNoticiasPorUsuario = async (id, rol) => {
    const [resultado] = await poolSQL.query(
        'select * from noticias where ' + rol + '_id = ? order by fecha_publicacion desc',
        [id]
    );
    return resultado;
}

// const seleccionarNoticiasDeRedactor = async (idRedactor) => {
//     const [resultado] = await poolSQL.query(
//         'select * from noticias where redactor_id = ? order by fecha_publicacion desc', 
//         [idRedactor]
//     );
//     return resultado;
// }

// const seleccionarNoticiasDeEditor = async (idEditor) => {
//     const [resultado] = await poolSQL.query(
//         'select * from noticias where editor_id = ? order by fecha_publicacion desc', 
//         [idEditor]
//     );
//     return resultado;
// }

const seleccionarNoticiasPorSeccionCategoria = async (seccion, categoriaId) => {
    console.log('categoria ID', categoriaId)
    const [resultado] = await poolSQL.query(
        'select * from noticias where secciones = ? and categoria_id = ? order by fecha_publicacion desc',
        [seccion, categoriaId]
    );
    return resultado;
}

const insertarNoticia = async ({ titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug }) => {
    const [resultado] = await poolSQL.query(
        'insert into noticias (titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug]
    );
    if (resultado.affectedRows != 1) {
        return -1;
    }
    return resultado.insertId;
}

const actualizarNoticia = async (id, { titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug }) => {
    const [resultado] = await poolSQL.query(
        'update noticias set titular = ?, imagen = ?, texto = ?, secciones = ?, fecha_publicacion = ?, redactor_id = ?, editor_id = ?, categoria_id = ?, estado = ?, importancia = ?, cambios = ?, slug = ? where id = ?',
        [titular, imagen, texto, secciones, fecha_publicacion, redactor_id, editor_id, categoria_id, estado, importancia, cambios, slug, id]
    );
    return resultado.affectedRows;
}

const borrarNoticia = async (id) => {
    const [resultado] = await poolSQL.query(
        'delete from noticias where id = ?',
        [id]
    );
    return resultado.affectedRows;
}

module.exports = {
    seleccionarNoticiaPorId,
    seleccionarNoticiasPorUsuario,
    // seleccionarNoticiasDeRedactor,
    // seleccionarNoticiasDeEditor,
    seleccionarNoticiasPorSeccionCategoria,
    insertarNoticia,
    actualizarNoticia,
    borrarNoticia
};

// seleccionarNoticiasPorSeccionCategoria
// seleccionarNoticiaPorId
// seleccionarNoticiasDeUsuario

// insertarNoticia
// actualizarNoticia
// borrarNoticia

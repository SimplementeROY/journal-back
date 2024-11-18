const nodemailer = require("nodemailer");
require('dotenv').config();

const puerto = process.env.PUERTOGMAIL;
const hostgmail = process.env.HOSTGMAIL;
const nuestroEmail = process.env.CORREOGMAIL;
const password = process.env.PASSWORDGMAIL;

const transporter = nodemailer.createTransport({
    host: hostgmail,
    port: puerto,
    secure: true,
    auth: {
        user: nuestroEmail,
        pass: password
    }
});

// async..await is not allowed in global scope, must use a wrapper
async function enviarEmailSuscriptor({ para, asunto, texto, textohtml }) {
    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `Periodico upgrade hub ${nuestroEmail}`, // sender address
            to: `${para}, ${nuestroEmail}`, // string de lista de correos separados por coma
            subject: asunto,
            text: texto,
            html: textohtml,
        });
        console.log("INFO: ", info);
        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    enviarEmailSuscriptor,
}
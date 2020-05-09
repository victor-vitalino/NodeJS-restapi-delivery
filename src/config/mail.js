export default {
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    default: {
        from: 'Equipe FastFeet <noreply@fastfeet.com>',
    },
};

/**
 * Configuração do nodemailer utilizando dados
 * do mailTrap
 */

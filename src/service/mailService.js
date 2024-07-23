const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: '"F-JOB" <pt922002@gmail.com>',
        to,
        subject,
        text,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
};

module.exports = {
    sendMail,
};
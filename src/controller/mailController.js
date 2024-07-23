const { sendMail } = require("../service/mailService");
const nodemailer = require("nodemailer");
const sendApplicationMail = async (req, res) => {
    const { email, date, time, description } = req.body;

    try {
        const subject = 'Interview Schedule';
        const text = `Dear Valued Candidate,\n\nYou have been scheduled for an interview on ${date} at ${time}.\n\nDescription: ${description}\n\nBest Regards,\nYour Company`;

        await sendMail(email, subject, text);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email' });
    }
};

const sendRejectEmail = async (req, res) => {
    const { email, reason } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: '"F-JOB" <pt922002@gmail.com>',
        to: email,
        subject: "Application Rejected",
        // text: `We regret to inform you that your application has been rejected. Reason: ${reason}`,
        text: `We regret to inform you that your application has been rejected.`,

    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }
};

module.exports = {
    sendApplicationMail,
    sendRejectEmail
};
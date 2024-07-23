const { sendMail } = require("../service/mailService");

const sendApplicationMail = async (req, res) => {
    const { email, time, description } = req.body;

    try {
        const subject = 'Interview Schedule';
        const text = `Dear Applicant,\n\nYou have been scheduled for an interview at ${time}.\n\nDescription: ${description}\n\nBest Regards,\nYour Company`;

        await sendMail(email, subject, text);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email' });
    }
};

module.exports = {
    sendApplicationMail,
};
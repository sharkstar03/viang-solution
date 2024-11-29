const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta actual
app.use(express.static('./'));

// Configurar el transporter de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, service, message } = req.body;
        console.log('Received form submission:', req.body);

        // Configurar el correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // El correo que recibirá los mensajes
            subject: `New Contact Form Submission - ${service}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
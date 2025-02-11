const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Updated CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'https://portfolio2-nine-psi.vercel.app', // Add your frontend domain
        'https://portfolio2-api-nine.vercel.app'  // Add your API domain
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Nodemailer setup with better email formatting
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email verification error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Email HTML template
const createEmailHTML = (name, email, subject, message) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a192f; color: #ccd6f6;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #64ffda; font-size: 24px; margin: 0;">New Message from Portfolio</h2>
            <div style="width: 50px; height: 3px; background: #64ffda; margin: 15px auto;"></div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(100, 255, 218, 0.1);">
            <h3 style="color: #64ffda; margin-top: 0; font-size: 18px;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #8892b0;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; color: #ccd6f6;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #8892b0;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; color: #ccd6f6;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #8892b0;"><strong>Subject:</strong></td>
                    <td style="padding: 8px 0; color: #ccd6f6;">${subject}</td>
                </tr>
            </table>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 10px; border: 1px solid rgba(100, 255, 218, 0.1);">
            <h3 style="color: #64ffda; margin-top: 0; font-size: 18px;">Message</h3>
            <p style="color: #ccd6f6; line-height: 1.6; margin: 0;">${message}</p>
        </div>

        <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid rgba(100, 255, 218, 0.1);">
            <p style="color: #8892b0; font-size: 12px; margin: 0;">
                This email was sent from your portfolio contact form
            </p>
        </div>
    </div>
`;

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Endpoint to handle form submission
app.post('/send', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Log the submission
    console.log(`New message from ${name} (${email}) - IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid email format.' 
        });
    }

    // Check for disposable email domains
    const disposableDomains = [
        "mailinator.com",
        "10minutemail.com",
        "tempmail.com",
        "guerrillamail.com",
        "yopmail.com",
    ];

    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please use a non-disposable email address.' 
        });
    }

    // Setup email options
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        text: `
From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `,
        html: createEmailHTML(name, email, subject, message)
    };

    // Send email
    transporter.sendMail(mailOptions)
        .then(info => {
            console.log('Email sent successfully:', info.messageId);
            res.status(200).json({ 
                success: true, 
                message: 'Message sent successfully!',
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress 
            });
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error sending message. Please try again later.' 
            });
        });
});

app.post('/api/send', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact from ${name}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
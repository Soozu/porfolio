const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer setup with better email formatting
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const nodemailer = require('nodemailer');
const jsonParser = express.json();

const app = express();
app.use(cors());

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/email', jsonParser, (req, res) => {
    const { contact_name, email_from, email_body } = req.body;

    async function main() {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'hollymrogers12@gmail.com',
                pass: process.env.email_pass,
            },
        });

        let info = await transporter.sendMail({
            from: email_from,
            to: 'hollymrogers12@gmail.com',
            subject: `Portfolio Contact Sheet - ${contact_name}`,
            text: email_body,
        });

        res.send(info);
    }

    main().catch(console.error);
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

module.exports = app;

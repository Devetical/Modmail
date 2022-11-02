require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { readFileSync, readdirSync } = require('fs');
const { join } = require('path')
const https = require('https');
const http = require('http');
const imgUrl = process.env.LOGVIEWER_HTTPS ? `https://${process.env.LOGVIEWER_URL}/assets/mail.png` : `http://${process.env.LOGVIEWER_URL}/assets/mail.png`;
const chroma = require('chroma-js');

module.exports = async() => {
    const mongoConnect = async () => {
        try {
            console.log(`[LOGVIEWER]`.green + ` Connecting to database...`);
            await mongoose.connect(process.env.MONGO_URI, {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log(`[LOGVIEWER]`.green + ` Connected to MongoDB`);
        } catch (err) {
            console.error(err);
        }

        readdirSync(join(__dirname, '../modmail/src/models'), { withFileTypes: true }).forEach(file => {
            if (file.isFile()) {
                require(join(__dirname, `../modmail/src/models/${file.name}`));
            }
        })
    }

    if (process.env.LOGVIEWER_HTTPS === 'true') {
        https.createServer({
            key: readFileSync(`/etc/letsencrypt/live/${process.env.LOGVIEWER_URL}/privkey.pem`),
            cert: readFileSync(`/etc/letsencrypt/live/${process.env.LOGVIEWER_URL}/fullchain.pem`),
        }, app).listen(443, () => {
            console.log(`[LOGVIEWER]`.green + ` Listening on port 443 - https://${process.env.LOGVIEWER_URL}/`);
        });
    } else {
        http.createServer(app).listen(80, () => {
            console.log(`[LOGVIEWER]`.green + ` Listening on port 80 - http://${process.env.LOGVIEWER_URL}/`);
        });
    }

    mongoConnect();

    app.set('view engine', 'ejs');
    app.set('views', join(__dirname, 'views'));

    app.get('/', async (req, res) => {
        const image = `<img src="${imgUrl}" width="200px" height="200px" alt="Modmail Logo"></img>`;
        const meta = `
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="og:theme-color" content="#fffffe">
            <meta name="og:title" content="Modmail Log Viewer">
            <meta name="og:description" content="Logviewer for Devetical's modmail bot">
            <meta name="og:image" content="${imgUrl}">
        `
        return res.render('welcome', { image, meta });
    });

    app.get('/logs/:id', async (req, res) => {
        const log = await mongoose.model('Log').findOne({ _id: req.params.id });

        if (!log) {
            const meta = `
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="og:theme-color" content="#fffffe">
                <meta name="og:title" content="Logviewer - Unknown Log">
                <meta name="og:description" content="Couldn't find log with id ${req.params.id}">
                <meta name="og:image" content="${imgUrl}">
            `
            const image = `<img src="${imgUrl}" width="200px" height="200px" alt="Modmail Logo"></img>`;
            const log_id = req.params.id;

            return res.render('nolog', { meta, image, log_id });
        }

        const guild = await mongoose.model('Guild').findOne({ _id: log.guild_id });
        const config = guild.config;

        // Log found, render the page
        const threadInfo = `
            <h3>Thread Info -</h3>
            <p>Thread ID: ${log._id}</p>
            <p>Thread User: ${log.user}</p>
            <p>Thread Messages: ${log.messages.length}</p>
            <br>
        `
        const meta = `
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="og:theme-color" content="#fffffe">
            <meta name="og:title" content="Logviewer - ${log._id}">
            <meta name="og:description" content="Log user - ${log.user}">
            <meta name="og:image" content="${imgUrl}">
        `
        const messages = log.messages
        const title = `<title>Logviewer - ${log.user.split(' ')[0]}</title>`;
        const icon = `<link rel="icon" href="${imgUrl}">`;
        const image = `<img src="${imgUrl}" width="100px" height="100px" alt="Modmail Logo"></img>`;

        res.render('log', { threadInfo, meta, messages, title, icon, image, config, chroma });
    })

    app.get('/assets/:file', (req, res) => {
        res.sendFile(join(__dirname, `assets/${req.params.file}`));
    });
}
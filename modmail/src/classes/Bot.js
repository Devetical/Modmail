const { Client, Collection } = require('discord.js');
const { readdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const mongoose = require('mongoose');
const EmbedManager = require('./EmbedManager');

class BotClient extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
        this.token = process.env.TOKEN;
        this.db_uri = process.env.MONGO_URI;
        this.embeds = new EmbedManager(this);
        this.isThread = require('../utils/isThread').isThread;
        this.handleUserMessage = require('../utils/handleUserMessage').handleUserMessage;
        this.handleStaffMessage = require('../utils/handleStaffMessage').handleStaffMessage;
        this.handleThreadSubscription = require('../utils/handleThreadSubscription').handleThreadSubscription;
        this.handleThreadAlert = require('../utils/handleThreadAlert').handleThreadAlert;
        this.handleThreadClose = require('../utils/handleThreadClose').handleThreadClose;
    }

    async start() {
        console.log(`\n\nWelcome to Modmail! This bot was developed by Dan Perkins (ÄsthetischerMensch#0001) and is open source. You can find the source code at https://github.com/Devetical/Modmail\n\nVerified plugins for this bot can be found at https://github.com/Devetical/Modmail-Plugins\n\n`.blue)
        console.log(`[BOT]`.green + ` Starting...`);
        await this.loadEvents();
        await this.loadCommands();
        await this.loadDatabase();
        this.login(this.token)
    }

    async loadEvents() {
        readdirSync(join(__dirname, '../events')).forEach(file => {
            const Event = require(join(__dirname, `../events/${file}`));
            const event = new Event();
            this.on(event.name, (...args) => event.run(this, ...args));
        })
    };

    async loadCommands() {
        readdirSync(join(__dirname, '../commands')).forEach(folder => {
            readdirSync(join(__dirname, `../commands/${folder}`)).forEach(file => {
                const Command = require(join(__dirname, `../commands/${folder}/${file}`));
                const command = new Command();
                this.commands.set(command.name, command);
            })
        })
    };

    async loadDatabase() {
        await mongoose.connect(this.db_uri, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.db = mongoose;

        readdirSync(join(__dirname, '../models'), { withFileTypes: true }).forEach(file => {
            if (file.isFile()) {
                require(join(__dirname, `../models/${file.name}`));
            }
        })

        console.log(`[DATABASE]`.green + ` Connected to database, models loaded.`);

        this.models = {
            guilds: mongoose.model('Guild'),
            users: mongoose.model('User'),
            logs: mongoose.model('Log'),
            Guild: mongoose.model('Guild'),
            User: mongoose.model('User'),
            Log: mongoose.model('Log')
        }
    };
}

module.exports = BotClient;
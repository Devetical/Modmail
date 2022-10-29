module.exports = async() => {
    const { IntentsBitField, Partials } = require("discord.js");
    const BotClient = require("./classes/Bot");
    require('dotenv').config();

    const client = new BotClient({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildBans,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
            IntentsBitField.Flags.DirectMessages,
            IntentsBitField.Flags.DirectMessageTyping,
            IntentsBitField.Flags.DirectMessageReactions
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
            Partials.Reaction,
            Partials.User,
            Partials.GuildMember
        ]
    })

    client.start();
}
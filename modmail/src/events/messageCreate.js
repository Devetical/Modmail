const { DMChannel } = require('discord.js');
const Event = require('../classes/Event');
const { handleModmail } = require('../utils/handleUserMessage');

class MessageCreateEvent extends Event {
    constructor() {
        super('messageCreate');
    }

    async run(client, message) {
        if (message.author.bot) return;

        const guildData = await client.models.guilds.findOne({ _id: process.env.MAIN_GUILD })
            || await new client.models.Guild({ _id: process.env.MAIN_GUILD }).save();
        const userData = await client.models.users.findOne({ _id: message.author.id })
            || await new client.models.User({ _id: message.author.id }).save();

        if (message.channel instanceof DMChannel) {
            if (userData.blocked) return await message.react('❌');

            return client.handleUserMessage(client, message, guildData, userData);
        }

        if (!message.content.startsWith(guildData.prefix)) return;

        const args = message.content.slice(guildData.prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const cmd = client.commands.get(cmdName);

        if (!cmd) return;

        const usage = {
            client: client,
            message: message,
            guildData: guildData,
            userData: userData,
            args: args
        }
        cmd.run(usage);
    }
}

module.exports = MessageCreateEvent;
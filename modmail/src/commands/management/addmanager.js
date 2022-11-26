const { PermissionFlagsBits } = require("discord.js");
const Command = require("../../classes/Command");

class AddManager extends Command {
    constructor() {
        super({
            name: 'addmanager',
            description: 'Add a bot manager',
            aliases: [ 'addm' ],
            usage: '{PREFIX}addmanager <user>',
            category: 'management',
        })
    }

    async run({ client, message, args, guildData, userData }) {
        if (!message.member.id === message.guild.ownerId) return;

        let member = message.mentions.users.first();
        if (!member) {
            if (!message.guild.members.cache.get(args[0])) return client.embeds.error({
                message: message,
                options: {
                    error: `Invalid user provided. Please either mention a user or provide a user ID.`
                }
            })

            member = message.guild.members.cache.get(args[0]);
        }

        guildData.managers.push(member.id);
        await guildData.save();

        return client.embeds.success({
            message: message,
            options: {
                description: `Successfully set ${message.guild.members.cache.get(member.id).toString()} as a bot manager for modmail`
            }
        })
    }
}

module.exports = AddManager;
const Command = require("../../classes/Command");

class Block extends Command {
    constructor() {
        super({
            name: 'block',
            description: 'Block a user',
            usage: '``{PREFIX}block <user>``',
            category: 'management'
        })
    }

    async run({ client, message, args, guildData, userData }) {
        if (!message.member.roles.cache.has(guildData.modmail_role)) return client.embeds.error({
            message: message,
            options: {
                error: `You don't have the required bot permissions to block users`,
                userAuthor: true
            }
        })

        const runInThread = await client.models.logs.findOne({ _id: message.channel.id });

        if (runInThread && !args[0] && !message.mentions.users.first()) {
            const user = await client.models.users.findOne({ _id: message.channel.topic });
            user.blocked = true;
            await user.save();

            return client.embeds.success({
                message: message,
                options: {
                    description: `Successfully blocked <@${message.channel.topic}> from modmail`
                }
            })
        }
    }
}

module.exports = Block;
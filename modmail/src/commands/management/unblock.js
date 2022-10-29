const Command = require("../../classes/Command");

class Unblock extends Command {
    constructor() {
        super({
            name: 'unblock',
            description: 'Unblock a user',
            usage: '``{PREFIX}Unblock <user>``',
            category: 'management'
        })
    }

    async run({ client, message, args, guildData, userData }) {
        if (!message.member.roles.cache.has(guildData.modmail_role)) return client.embeds.error({
            message: message,
            options: {
                error: `You don't have the required bot permissions to unblock users`,
                userAuthor: true
            }
        })

        const runInThread = await client.models.logs.findOne({ _id: message.channel.id });

        if (runInThread && !args[0] && !message.mentions.users.first()) {
            const user = await client.models.users.findOne({ _id: message.channel.topic });
            user.blocked = false;
            await user.save();

            return client.embeds.success({
                message: message,
                options: {
                    description: `Successfully unblocked <@${message.channel.topic}> from modmail`
                }
            })
        } else if (args[0] || message.mentions.users.first()) {
            const userID = message.mentions?.users?.first()?.id || args[0];
            const user = await client.models.users.findOne({ _id: userID });
            user.blocked = false;
            await user.save();

            return client.embeds.success({
                message: message,
                options: {
                    description: `Successfully unblocked <@${userID}> from modmail`
                }
            })
        }
    }
}

module.exports = Unblock;
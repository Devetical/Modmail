const Command = require('../../classes/Command');

class Reply extends Command {
    constructor() {
        super({
            name: 'reply',
            aliases: [ 'r' ],
            description: 'Reply to a user in a modmail thread',
            usage: '``{PREFIX}reply <message>``',
            category: 'modmail'
        })
    }

    async run({ client, message, args, guildData }) {
        if (!message.member.roles.cache.has(guildData.modmail_role)) return client.embeds.error({
            message: message,
            options: {
                error: `You don't have the required bot permissions to run modmail commands`,
                userAuthor: true
            }
        })
        
        if (!args.length) return client.embeds.error({
            message: message,
            options: {
                error: `You must provide a message to send to the user`
            }
        })

        return client.handleStaffMessage(client, message, args.join(' '), false, guildData);
    }
}

module.exports = Reply;
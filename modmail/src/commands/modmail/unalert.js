const Command = require('../../classes/Command');

class Unalert extends Command {
    constructor() {
        super({
            name: 'unalert',
            aliases: [ 'una' ],
            description: 'Remove yourself from getting notified on the next message send by a user to a modmail thread',
            usage: '{PREFIX}unalert',
            category: 'modmail'
        })
    }

    async run({ client, message, guildData }) {
        if (!message.member.roles.cache.has(guildData.modmail_role)) return client.embeds.error({
            message: message,
            options: {
                error: `You don't have the required bot permissions to run modmail commands`,
                userAuthor: true
            }
        })
        
        return client.handleThreadAlert(client, message, 'remove', guildData);
    }
}

module.exports = Unalert;
const Command = require('../../classes/Command');

class Alert extends Command {
    constructor() {
        super({
            name: 'alert',
            aliases: [ 'al' ],
            description: 'Get notified on the next message send by a user to a modmail thread',
            usage: '{PREFIX}alert',
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
        
        return client.handleThreadAlert(client, message, 'add', guildData);
    }
}

module.exports = Alert;
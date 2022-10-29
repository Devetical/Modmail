const Command = require('../../classes/Command');

class Unsubscribe extends Command {
    constructor() {
        super({
            name: 'unsubscribe',
            description: 'Unsubscribe from a modmail thread',
            usage: '``{PREFIX}unsubscribe``',
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
        
        return client.handleThreadSubscription(client, message, 'remove');
    }
}

module.exports = Unsubscribe;
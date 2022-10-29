const Command = require('../../classes/Command');

class Subscribe extends Command {
    constructor() {
        super({
            name: 'subscribe',
            description: 'Subscribe to a modmail thread',
            usage: '``{PREFIX}subscribe``',
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
        
        return client.handleThreadSubscription(client, message, 'add');
    }
}

module.exports = Subscribe;
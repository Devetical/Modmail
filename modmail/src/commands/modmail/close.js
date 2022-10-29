const Command = require('../../classes/Command');

class Close extends Command {
    constructor() {
        super({
            name: 'close',
            description: 'Close a modmail thread',
            usage: '``{PREFIX}close``',
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
        
        return client.handleThreadClose(client, message, guildData);
    }
}

module.exports = Close;
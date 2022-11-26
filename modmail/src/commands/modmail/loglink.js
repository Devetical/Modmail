const Command = require('../../classes/Command');
const generateLink = (id) => process.env.LOGVIEWER_HTTPS ? `https://${process.env.LOGVIEWER_URL}/logs/${id}` : `http://${process.env.LOGVIEWER_URL}/logs/${id}`;

class Loglink extends Command {
    constructor() {
        super({
            name: 'loglink',
            aliases: [ 'll' ],
            description: 'Get a loglink for the current thread',
            usage: '``{PREFIX}loglink``',
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

        const isThread = client.isThread(client, message);

        if (!isThread) return client.embeds.error({
            message: message,
            options: {
                error: `This command can only be run in a modmail thread`
            }
        });
        
        return client.embeds.success({
            message: message,
            options: {
                title: `Loglink`,
                description: `Here is the loglink for this thread: [click here](${generateLink(message.channel.id)})`,
            }
        })
    }
}

module.exports = Loglink;
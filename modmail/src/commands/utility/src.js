const { EmbedBuilder } = require('discord.js');
const Command = require("../../classes/Command");

class Source extends Command {
    constructor() {
        super({
            name: 'source',
            description: 'Get a link to the bot\'s source code',
            category: 'utility'
        })
    }

    async run({ client, message }) {
        const sourceEmbed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Modmail Source Code')
            .setDescription(`
                The source code for this bot can be found [here](https://github.com/Devetical/Modmail).\n\nThe source code for verified modmail plugins can be found [here](https://github.com/Devetical/Modmail-Plugins).\n\nIf you have any questions, feel free to join the [support server](https://discord.gg/gApddut58m).
            `)
        
        return message.reply({ embeds: [sourceEmbed] });
    }
}

module.exports = Source;
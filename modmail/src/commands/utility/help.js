const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Command = require("../../classes/Command");

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Get info on the bot\'s commands',
            category: 'utility'
        })
    }

    async run({ client, message }) {
        const helpMenu = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('Click here to select a command category')
                    .addOptions([
                        { label: 'Modmail', description: 'Modmail commands', value: 'modmail' },
                        { label: 'Utility', description: 'Utility commands', value: 'utility' },
                        { label: 'Exit', description: 'Exit help menu', value: 'exit' }
                    ])
            )
        
        const staffHelpMenu = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('Click here to select a command category')
                    .addOptions([
                        { label: 'Modmail', description: 'Modmail commands', value: 'modmail' },
                        { label: 'Utility', description: 'Utility commands', value: 'utility' },
                        { label: 'Management', description: 'Management commands', value: 'management' },
                        { label: 'Exit', description: 'Exit help menu', value: 'exit' }
                    ])
            )
        
        const helpEmbed = new EmbedBuilder()
            .setColor('White')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setDescription('Select a category from the menu below to view commands')
        
        const isStaff = message.member.permissions.has(PermissionFlagsBits.ManageGuild);

        if (!isStaff) {
            await message.reply({ embeds: [ helpEmbed ], components: [ helpMenu ] });
            return;
        } else {
            await message.reply({ embeds: [ helpEmbed ], components: [ staffHelpMenu ] })
        }
    }
}

module.exports = Help;
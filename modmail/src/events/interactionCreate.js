const { EmbedBuilder } = require('discord.js');
const Event = require('../classes/Event');
const { helpMenu } = require('../utils/helpMenu');

class InteractionCreateEvent extends Event {
    constructor() {
        super('interactionCreate');
    }

    async run(client, interaction) {
        if (interaction.isSelectMenu() && interaction.customId === "help_menu") {
            const category = interaction.values[0];

            helpMenu(interaction, category, new EmbedBuilder(), client);
        }
    }
}

module.exports = InteractionCreateEvent;
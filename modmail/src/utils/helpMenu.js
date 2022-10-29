module.exports.helpMenu = async function (interaction, category, embed, client) {
    const commands = [];

    client.commands.forEach(command => {
        commands.push({
            name: command.name,
            category: command.category,
            description: command.description
        })
    })

    // Modmail category menu builder
    if (category === "modmail") {
        const mmCmds = commands.filter(c => c.category === "modmail");

        const cmdMap = mmCmds.map(c => `__**${c.name[0].toUpperCase() + c.name.slice(1)}**__ - ${c.description[0].toUpperCase() + c.description.slice(1)}`).join('\n\n');

        return interaction.update({ embeds: [ embed.setTitle('Modmail Commands:').setColor('White').setDescription(cmdMap) ] });
    
    // Utility category menu builder
    } else if (category === "utility") {
        const mgtCmds = commands.filter(c => c.category === "utility");

        const cmdMap = mgtCmds.map(c => `__**${c.name[0].toUpperCase() + c.name.slice(1)}**__ - ${c.description[0].toUpperCase() + c.description.slice(1)}`).join('\n\n');

        return interaction.update({ embeds: [ embed.setTitle('Utility Commands:').setColor('White').setDescription(cmdMap) ] });
    }

    // Management category menu builder
    if (category === "management") {
        const mgtCmds = commands.filter(c => c.category === "management");

        const cmdMap = mgtCmds.map(c => `__**${c.name[0].toUpperCase() + c.name.slice(1)}**__ - ${c.description[0].toUpperCase() + c.description.slice(1)}`).join('\n\n');

        return interaction.update({ embeds: [ embed.setTitle('Management Commands:').setColor('White').setDescription(cmdMap) ] });
    }

    // Exit menu builder
    if (category === "exit") {
        return interaction.message.delete();
    }
}
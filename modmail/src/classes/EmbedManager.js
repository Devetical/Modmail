const { EmbedBuilder } = require("discord.js");

class EmbedManager {
    constructor(client) {
        this.client = client;
    }

    async success({ message, options }) {
        if (!message || !options) throw new Error(`One or more required properties are missing to run the "success" method.`);
        if (!options.description) throw new Error(`You must supply a description for the "success" method`);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription('<:success:993459347021631498> ' + options.description)
        
            if (options.author && typeof options.author === 'boolean') embed.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png' })})
        if (options.footer && typeof options.footer === 'object') embed.setFooter(options.footer)
        if (options.title && typeof options.title === 'string') embed.setTitle(options.title)
        if (options.thumbnail && typeof options.title === 'string') embed.setThumbnail(options.thumbnail)
        if (options.image && typeof options.image === 'string') embed.setImage(options.image)

        return message.reply({ embeds: [ embed] });
    }

    async error({ message, options }) {
        if (!message || !options) throw new Error(`One or more required properties are missing to run the "error" method.`);
        if (!options.error) throw new Error(`You must supply an error for the "error" method`);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('<:error:993458753972211754> ' + options.error)
        
        if (options.author && typeof options.author === 'boolean') embed.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png' })})
        if (options.footer && typeof options.footer === 'object') embed.setFooter(options.footer)
        if (options.title && typeof options.title === 'string') embed.setTitle(options.title)
        if (options.thumbnail && typeof options.title === 'string') embed.setThumbnail(options.thumbnail)
        if (options.image && typeof options.image === 'string') embed.setImage(options.image)

        return message.reply({ embeds: [ embed] })
    }
}

module.exports = EmbedManager;
const { EmbedBuilder } = require("discord.js");

module.exports.handleStaffMessage = async (client, message, args, anonymous, guildData) => {
    const isThread = await client.isThread(client, message);

    if (!isThread) { return client.embeds.error({
            message: message,
            options: {
                error: `Reply commands can only be run in a modmail thread`
            }
        })
    }

    const staffMessage = new EmbedBuilder()
        .setColor(guildData.config.staff_embed_color)
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png' }) })
        .setDescription(args)
        .setTimestamp()
    
    if (anonymous) staffMessage.setFooter({ text: 'Anonymous Reply' });
    
    const userMessage = new EmbedBuilder()
        .setColor(guildData.config.staff_embed_color)
        .setAuthor({ name: anonymous ? guildData.config.staff_anonymous_author_name : message.author.username, iconURL: anonymous ? guildData.config.staff_anonymous_author_icon : message.author.displayAvatarURL({ extension: 'png' }) })
        .setDescription(args)
    
    const thread = message.channel;
    const threadUser = client.users.cache.get(thread.topic);

    if (!threadUser) return client.embeds.error({
        message: message,
        options: {
            error: `This thread's user could not be found`
        }
    })
    
    thread.send({ embeds: [ staffMessage ] });
    try {
        threadUser.send({ embeds: [ userMessage ] });
    } catch (err) {
        console.error(`[MODMAIL] An error occurred while attempting to send a message to ${threadUser.username}#${threadUser.discriminator}`);
        return client.embeds.error({
            message: message,
            options: {
                error: `An error occurred while attempting to send a message to ${threadUser.username}#${threadUser.discriminator}`
            }
        })
    }

    const threadLog = await client.models.logs.findOne({ _id: thread.id });

    threadLog.messages.push({
        user: message.author.username + '#' + message.author.discriminator,
        avatar: message.author.displayAvatarURL({ format: 'png' }),
        timestamp: message.createdTimestamp,
        internal: true,
        content: args
    })

    if (guildData.config.auto_alert_last_response) {
        await client.handleThreadAlert(client, message, 'add', guildData);
    }

    await threadLog.markModified('messages');
    await threadLog.save();

    message.delete()
}
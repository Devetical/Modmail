const { EmbedBuilder } = require("discord.js");
const logUrl = (id) => process.env.LOGVIEWER_HTTPS ? `https://${process.env.LOGVIEWER_URL}/logs/${id}` : `http://${process.env.LOGVIEWER_URL}/logs/${id}`;

module.exports.handleThreadClose = async(client, message, guildData) => {
    const isThread = await client.isThread(client, message);

    if (!isThread) return client.embeds.error({
        message: message,
        options: {
            error: `This is not a modmail thread`
        }
    })

    const threadLog = await client.models.logs.findOne({ _id: message.channel.id });
    const thread = message.channel;
    const threadUser = client.users.cache.get(thread.topic);

    const closeEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`Closing thread...`)
    
    thread.send({ embeds: [ closeEmbed ] });

    const closeMessage = new EmbedBuilder()
        .setColor('Red')
        .setTitle(`Thread Closed`)
        .setDescription(`Thank you for contacting our support team! We hope we were able to assist you with your issue. If you have any further questions, please feel free to open a new thread.`)
    
    try {
        threadUser.send({ embeds: [ closeMessage ] });
    } catch (err) {
        console.error(`[MODMAIL] An error occurred while attempting to send a message to ${threadUser.username}#${threadUser.discriminator}`);
    }

    threadLog.messages.push({
        user: message.author.username + '#' + message.author.discriminator,
        avatar: message.author.displayAvatarURL({ format: 'png' }),
        timestamp: message.createdTimestamp,
        internal: true,
        content: `Closed the thread.`
    })

    await threadLog.markModified('messages');
    await threadLog.save();

    thread.delete();

    const logChannel = client.channels.cache.get(guildData.log_channel);

    const logEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`Thread Log`)
        .setDescription(`**User:** \`\`\`${threadUser.username}#${threadUser.discriminator} (${threadUser.id})\`\`\`\n\n**Closed By:** \`\`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\`\`\`\n\n**Closed At:** \`\`\`${new Date().toLocaleString()}\`\`\`\n\n**Thread ID:** \`\`\`${thread.id}\`\`\`\n\n**Thread Link:** [Click Here](${logUrl(thread.id)})`)
    
    return logChannel.send({ embeds: [ logEmbed ] });
}
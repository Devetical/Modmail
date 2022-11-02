module.exports.handleThreadSubscription = async(client, message, operation, guildData) => {
    const thread = await client.models.logs.findOne({ _id: message.channel.id });
    if (!thread) return client.embeds.error({
        message: message,
        options: {
            error: `This command can only be used in a modmail thread`
        }
    })

    if (operation === 'add') {
        if (thread.subscribed.includes(message.author.id)) return client.embeds.error({
            message: message,
            options: {
                error: `You are already subscribed to this thread`
            }
        })

        thread.subscribed.push(message.author.id);
        await thread.save();

        return client.embeds.success({
            message: message,
            options: {
                description: `You have subscribed to this thread`
            }
        })
    } else if (operation === 'remove') {
        if (!thread.subscribed.includes(message.author.id)) return client.embeds.error({
            message: message,
            options: {
                error: `You are not subscribed to this thread`
            }
        })

        thread.subscribed.splice(thread.subscribed.indexOf(message.author.id), 1);
        await thread.save();

        return client.embeds.success({
            message: message,
            options: {
                description: `You have unsubscribed from this thread`
            }
        })
    }
}
module.exports.handleThreadAlert = async(client, message, operation) => {
    const thread = await client.models.logs.findOne({ _id: message.channel.id });
    if (!thread) return client.embeds.error({
        message: message,
        options: {
            error: `This command can only be used in a modmail thread`
        }
    })

    if (operation === 'add') {
        if (thread.alert.includes(message.author.id)) return client.embeds.error({
            message: message,
            options: {
                error: `You are already set to be alerted on the next message sent by this user`
            }
        })

        thread.alert.push(message.author.id);
        await thread.save();

        return client.embeds.success({
            message: message,
            options: {
                description: `You have been set to be alerted on the next message sent by this user`
            }
        })
    } else if (operation === 'remove') {
        if (!thread.alert.includes(message.author.id)) return client.embeds.error({
            message: message,
            options: {
                error: `You are not set to be alerted on the next message sent by this user`
            }
        })

        thread.alert.splice(thread.alert.indexOf(message.author.id), 1);
        await thread.save();

        return client.embeds.success({
            message: message,
            options: {
                description: `You have been removed from the alerts on the next message sent by this user`
            }
        })
    }
}
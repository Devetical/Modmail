module.exports.isThread = async (client, message) => {
    const thread = await client.models.logs.findOne({ _id: message.channel.id });
    
    if (thread) {
        return true
    } else return false;
}
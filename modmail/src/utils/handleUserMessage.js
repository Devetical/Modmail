const { EmbedBuilder } = require("discord.js");
const colors = require('colors');

module.exports.handleUserMessage = async (client, message, guildData, userData) => {
    if (!guildData.setup) {
        return client.embeds.error({
            message: message,
            options: {
                error: `Modmail is not setup! Please have a server manager run the \`\`${guildData.prefix}setup\`\` command to get started`,
                userAuthor: false
            },
        })
    }

    
    let guild = client.guilds.cache.get(process.env.MODMAIL_GUILD);
    
    let thread = guild.channels.cache.find(c => c.topic === userData._id);

    if (thread) {
        const threadLog = await client.models.logs.findOne({ _id: thread.id });
        if (!threadLog) console.log(`[ERROR] No thread log found for ${thread.id}`.red);

        const userMessage = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ extension: 'png' }) })
            .setDescription(message.content)
            .setTimestamp()

        let pings = [];
        
        if (threadLog.subscribed.length > 0) threadLog.subscribed.forEach(sub => pings.push(sub));
        if (threadLog.alert.length > 0) threadLog.alert.forEach(alert => pings.push(alert));

        pings = pings.map(ping => `<@${ping}>`).join(', ');

        pings !== 'undefined' ? thread.send({ content: pings, embeds: [ userMessage ] }) : thread.send({ embeds: [ userMessage ]})

        threadLog.messages.push({
            user: message.author.username + '#' + message.author.discriminator,
            avatar: message.author.displayAvatarURL({ extension: 'png' }),
            timestamp: message.createdTimestamp,
            internal: false,
            content: message.content,
        })

        threadLog.alert = [];
        await threadLog.markModified('messages');
        await threadLog.save();

        await message.react('✅');
    } else {
        try {
            console.log(`[THREAD]`.yellow + ` Creating thread for ${message.author.username}#${message.author.discriminator} (${message.author.id})`);
            await guild.channels.create({
                name: `${message.author.username}-${message.author.discriminator}`,
                type: 0,
                topic: message.author.id,
                parent: guildData.main_category
            }).then(channel => thread = channel);
        } catch (err) {
            console.log(`[ERROR]`.red + ` Failed to create thread for ${message.author.username}#${message.author.discriminator} (${message.author.id})`);
            try {
                const fallback = guildData.categories.find(c => c.name === 'fallback');

                if (fallback) {
                    await guild.channels.create({
                        name: `${message.author.username}-${message.author.discriminator}`,
                        type: 0,
                        topic: message.author.id,
                        parent: guildData
                    }).then(channel => thread = channel)
                } else {
                    console.log(`[ERROR] No fallback category found for ${guild.name} (${guild.id})`.red);
                    return await message.react('❌');
                }
            } catch (err) {
                console.log(`[ERROR] An error occurred while attempting to create a thread for ${message.author.username}#${message.author.discriminator} (${message.author.id})`.red);
                return await message.react('❌');
            }
        }

        const mainGuildMember = client.guilds.cache.get(process.env.MAIN_GUILD).members.cache.get(message.author.id);
        const mainGuildMemberRoles = [];
        let extraRoles;
        mainGuildMember.roles.cache.forEach(role => {
            mainGuildMemberRoles.push(role.toString());
        })

        if (mainGuildMemberRoles.length > 19) {
            extraRoles = mainGuildMemberRoles.slice(19);
        }

        const threadCreatedEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Thread created')
            .setThumbnail(message.author.displayAvatarURL({ extension: 'png' }))
            .setDescription(`Use \`\`!r\`\` or \`\`!ar\`\` to reply`)
            .addFields(
                { name: 'User', value: mainGuildMember?.toString(), inline: true },
                { name: 'UserID', value: mainGuildMember?.id, inline: true },
                { name: 'Joined Main Guild', value: `<t:${String(mainGuildMember.joinedTimestamp / 1000).split('.')[0]}:R>`, inline: true },
                { name: 'Roles', value: mainGuildMemberRoles.length > 19 ? `${mainGuildMemberRoles.slice(0, 3).join(', ')} **+ ${extraRoles.length} More**` : `${mainGuildMemberRoles.join(', ')}`, inline: false }
            )
        
        const threadCreatedUserMessage = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ extension: 'png' }) })
            .setDescription(message.content)
            .setTimestamp()
        
        const threadCreatedUserEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Thread created')
            .setDescription(`Thanks for contacting modmail! Staff will reply shortly`)

        thread.send({ content: '@here', embeds: [ threadCreatedEmbed ] });
        thread.send({ embeds: [ threadCreatedUserMessage ] });
        message.author.send({ embeds: [ threadCreatedUserEmbed ] });

        const threadLog = new client.models.Log({ _id: thread.id, user: `${message.author.tag} (${message.author.id})` });

        threadLog.messages.push({
            user: message.author.username + '#' + message.author.discriminator,
            avatar: message.author.displayAvatarURL({ extension: 'png' }),
            timestamp: message.createdTimestamp,
            internal: false,
            content: message.content
        })

        await threadLog.markModified('messages');
        await threadLog.save();
        await message.react('✅');

        console.log(`[THREAD]`.yellow + ` Created thread for ${message.author.username}#${message.author.discriminator} (${message.author.id})`);
    }
}
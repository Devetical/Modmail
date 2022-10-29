const { EmbedBuilder } = require("discord.js");
const Command = require("../../classes/Command");

class Setup extends Command {
    constructor() {
        super({
            name: 'setup',
            description: 'Setup modmail',
            usage: '``{PREFIX}setup [category_id]``',
            category: 'management'
        });
    }

    async run({ client, message, args, guildData, userData }) {
        if (userData._id !== message.guild.ownerId && !guildData.managers.includes(userData._id)) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `You don't have the required bot permissions to setup modmail`,
                    userAuthor: true
                }
            })
        }

        if (message.guild.id !== process.env.MODMAIL_GUILD) return client.embeds.error({
            message: message,
            options: {
                error: `This command can only be run in the modmail server`,
                userAuthor: true
            }
        })

        if (guildData.setup) return client.embeds.error({
            message: message,
            options: {
                error: `Modmail is already setup. DM me to start a thread!`,
                userAuthor: false
            }
        })

        let category;
        let categoryId;
        let logId;
        let modmailRole;

        if (args[0] && !message.guild.channels.cache.get(args[0])) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `Invalid category ID provided. Note: If you don't provide an existing category, one will be created`,
                    userAuthor: false
                }
            })
        } else if (args[0] && message.guild.channels.cache.get(args[0])) {
            console.log(`[SETUP]`.yellow + ` Category ID provided, using existing category`);
            category = message.guild.channels.cache.get(args[0]);
            categoryId = category.id;

            const logChannel = await message.guild.channels.create({
                name: 'modmail-logs',
                type: 0,
                parent: categoryId
            })

            logId = logChannel.id;
        } else {
            console.log(`[SETUP]`.yellow + ` No category ID provided, creating new category`);
            category = await message.guild.channels.create({
                name: 'Modmail',
                type: 4
            });

            const logChannel = await message.guild.channels.create({
                name: 'modmail-logs',
                type: 0,
                parent: category.id
            })

            categoryId = category.id;
            logId = logChannel.id;
        }

        if (!message.guild.roles.cache.find(r => r.name === 'Modmail Access')) {
            modmailRole = await message.guild.roles.create({
                name: 'Modmail Access',
                reason: 'Modmail setup'
            })
        } else {
            modmailRole = message.guild.roles.cache.find(r => r.name === 'Modmail Access');
        }

        await category.permissionOverwrites.create(modmailRole, {
            SendMessages: true,
            ViewChannel: true
        });

        await category.permissionOverwrites.create(message.guild.roles.everyone.id, {
            ViewChannel: false
        });

        message.guild.members.me.roles.add(modmailRole);

        guildData.modmail_role = modmailRole.id;
        guildData.main_category = categoryId;
        guildData.log_channel = logId;
        guildData.setup = true;

        await guildData.save();

        console.log(`[SETUP]`.green + ` Successfully setup modmail`);
        return client.embeds.success({
            message: message,
            options: {
                description: `Modmail setup successfully! Log channel: <#${logId}>`,
                userAuthor: false
            }
        })
    }
}

module.exports = Setup;
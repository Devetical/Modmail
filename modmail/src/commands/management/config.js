const { EmbedBuilder } = require("discord.js");
const Command = require("../../classes/Command");
const options = {
    // Embed configuration
    user_color: { prop: 'user_embed_color', description: 'The color of user message embeds', type: 'hex' },
    staff_color: { prop: 'staff_embed_color', description: 'The color of staff message embeds', type: 'hex' },
    staff_anon_author_name: { prop: 'staff_anonymous_author_name', description: 'The name to be shown in the author field of anonymous staff messages', type: 'string' },
    staff_anon_author_icon: { prop: 'staff_anonymous_author_icon', description: 'The url of the icon to be shown in the author field of anonymous staff messages', type: 'url' },

    // Thread creation configuration
    thread_creation_ping_toggle: { prop: 'ping_role_on_thread_creation', description: 'Toggle whether the bot will ping a role upon thread creation', type: 'boolean' },
    thread_creation_ping_role: { prop: 'ping_role_on_thread_creation_role', description: 'Configure the role to be pinged on thread creation if the setting is set to true', type: 'role' },
    thread_creation_message: { prop: 'thread_creation_message', description: 'The message which will be sent to the user on thread creation', type: 'string' },
    fallback_category_id: { prop: 'fallback_category_id', description: 'In case the main modmail category is full, new threads will be created here', type: 'id' },

    // Thread closing configuration
    thread_close_message: { prop: 'thread_close_message', description: 'The message which will be sent to the user on thread close', type: 'string' },

    // Thread general configuration
    auto_alert_last_response: { prop: 'auto_alert_last_response', description: 'Toggle whether staff members should be auto-alerted to the next message sent in threads if they reply', type: 'boolean' },

    // Modmail
    prefix: { prop: 'prefix', description: 'The prefix to be used for bot commands', type: 'string' },
}

class Config extends Command {
    constructor() {
        super({
            name: 'config',
            description: 'Configure the bot',
            usage: '``{PREFIX}config <option> <value>``',
            category: 'management'
        })
    }

    async run({ client, message, args, guildData, userData }) {
        if (userData._id !== message.guild.ownerId && !guildData.managers.includes(userData._id)) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `You don't have the required bot permissions to configure modmail`,
                    userAuthor: true
                }
            })
        }

        const option = args[0];

        if (!option) return client.embeds.error({
            message: message,
            options: {
                error: `Please provide an option to configure, or "help" for more information`,
                userAuthor: true
            }
        })

        if (option === 'help') {
            const keys = Object.keys(options);
            const configurations = [];
            
            keys.forEach(key => {
                const option = options[key];
                configurations.push(`> \`\`${key}\`\` - ${option.description}`)
            })

            const configHelpEmbed = new EmbedBuilder()
                .setTitle('Modmail Configuration Help')
                .setDescription(`Here is a list of all the options you can configure with the \`\`${guildData.config.prefix}config\`\` command.\n\n${configurations.join('\n')}`)
                .setColor('Green')
                .setFooter({ text: `Set the value of an option by using ${guildData.config.prefix}config <option> <value>` })
            
            return message.reply({ embeds: [configHelpEmbed] })
        }

        const value = args.slice(1).join(' ');
        if (!value) return client.embeds.error({
            message: message,
            options: {
                error: `Please provide a value to configure for the provided option`,
                userAuthor: true
            }
        })

        const optionData = options[option];
        const optionValidation = optionData.type;

        switch (optionValidation) {
            case 'hex':
                if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) return client.embeds.error({
                    message: message,
                    options: {
                        error: `Please provide a valid hex color`,
                        userAuthor: true
                    }
                });
                break;
            case 'url':
                if (!/^https?:\/\/.+\..+$/.test(value)) return client.embeds.error({
                    message: message,
                    options: {
                        error: `Please provide a valid URL`,
                        userAuthor: true
                    }
                });
                break;
            case 'role':
                if (!message.mentions.roles.first() && !message.guild.roles.cache.get(value)) return client.embeds.error({
                    message: message,
                    options: {
                        error: `Please provide a valid role ID`,
                        userAuthor: true
                    }
                });
                break;
            case 'id':
                if (!message.guild.channels.cache.get(value)) return client.embeds.error({
                    message: message,
                    options: {
                        error: `Please provide a valid channel ID`,
                        userAuthor: true
                    }
                });
                break;
            case 'boolean':
                if (value !== 'true' && value !== 'false') return client.embeds.error({
                    message: message,
                    options: {
                        error: `Please provide a valid boolean value (true/false)`,
                        userAuthor: true
                    }
                });
                break;
        }

        const optionName = optionData.prop;
        const oldValue = guildData.config[optionName];
        guildData.config[optionName] = value;
        
        await guildData.markModified('config');
        await guildData.save();
        const newValue = guildData.config[optionName];

        client.embeds.success({
            message: message,
            options: {
                description: `Successfully updated the \`\`${option}\`\` configuration option.\n\n> **New Value:** \`\`${newValue}\`\``
            }
        });
    }
}

module.exports = Config;
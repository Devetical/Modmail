const Command = require("../../classes/Command");
const { installPlugin } = require('../../utils/installPlugin');
const { readdirSync, unlink, unlinkSync } = require('fs');
const { join } = require("path");

class Plugins extends Command {
    constructor() {
        super({
            name: 'plugins',
            description: 'Plugin management commands',
            aliases: [ 'plugin', 'plg' ],
            usage: '{PREFIX}plugin [add|remove|list] <github_link|plugin_name>',
            category: 'management'
        })
    }

    async run({ client, message, args, guildData, userData }) {
        if (userData._id !== message.guild.ownerId && !guildData.managers.includes(userData._id)) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `You don't have the required bot permissions to manage plugins`,
                    userAuthor: true
                }
            })
        }

        if (![ 'add', 'remove', 'list' ].includes(args[0])) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `Invalid command format. Command usage: ${this.usage.replace('{PREFIX}', guildData.config.prefix)}`
                }
            })
        }
        
        const cmd = args[0];

        if (!process.env.GITHUB_TOKEN) return client.embeds.error({
            message: message,
            options: {
                error: `The bot owner has not set a GitHub token. Please contact them to install plugins. See a guide [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)`
            }
        })

        if (cmd === 'add') {
            let link = args.slice(1).join('');
            const REGEX = {
                "REPO": /https:\/\/github.com\/([A-z0-9-]+)\/([A-z0-9-_]+)\/[blob|tree]+\/[main|master]+\/([A-z0-9-_\/]+.js)$/g,
                "GIST": /https:\/\/gist\.github\.com\/([A-z0-9-]+)\/([A-z0-9]+)/g,
            }

            if (link.match(REGEX["REPO"])) {
                const repoDetails = REGEX["REPO"].exec(link);
                repoDetails.shift();

                link = `https://api.github.com/repos/${repoDetails[0]}/${repoDetails[1]}/contents/${repoDetails[2]}`;

                return installPlugin(client, message, guildData, link, "repo")
            } else if (link.match(REGEX["GIST"])) {
                const repoDetails = REGEX["GIST"].exec(link);
                repoDetails.shift();

                link = `https://api.github.com/gists/${repoDetails[1]}`;

                return installPlugin(client, message, guildData, link, "gist")
            } else return client.embeds.error({
                message: message,
                options: {
                    error: `Invalid github link provided for plugin.`
                }
            })
        } else if (cmd === 'remove') {
            let pluginName = args[1];

            const plugin = readdirSync(join(__dirname, '../../plugins')).filter(file => file === `${pluginName}.js`)[0];
            
            if (!plugin) return client.embeds.error({
                message: message,
                options: {
                    error: `The provided plugin is not installed.`
                }
            })

            console.log(`[PLUGIN]`.yellow + ` Uninstalling plugin ${pluginName}...`);
            unlinkSync(join(__dirname, `../../plugins/${plugin}`));

            const pluginData = guildData.installed_plugins.find(i => i.name === pluginName);

            if (!pluginData) return client.embeds.success({
                message: message,
                options: {
                    message: `The provided plugin is installed locally, however was not found in the database. I have successfully removed it's local data.`
                }
            });

            pluginData.commands_added?.forEach(command => {
                client.commands.delete(command.name);
            });

            await guildData.installed_plugins.pull(pluginData);

            await guildData.markModified('installed_plugins');
            await guildData.save();

            console.log(`[PLUGIN]`.green + ` ${pluginName} has been uninstalled by ${message.author.tag}!`);
            client.embeds.success({
                message: message,
                options: {
                    description: `Successfully removed plugin \`${pluginName}\``
                }
            });
        } else if (cmd === 'list') {
            if (guildData.installed_plugins.length === 0) return client.embeds.error({
                message: message,
                options: {
                    error: `There are no plugins installed.`
                }
            })

            let plugins = guildData.installed_plugins.map(plugin => `> • ${plugin.name}`).join('\n');

            client.embeds.success({
                message: message,
                options: {
                    description: `Installed plugins:\n${plugins}`
                }
            })
        }
    }
}

module.exports = Plugins;
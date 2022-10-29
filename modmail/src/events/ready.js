const Event = require('../classes/Event');
const colors = require('colors');
const { renameSync, existsSync, readdirSync } = require('fs');
const { join } = require('path');

class ReadyEvent extends Event {
    constructor() {
        super('ready');
    }

    async run(client) {
        for (const guild of client.guilds.cache.values()) {
            await guild.members.fetch().catch(() => null);
            await guild.channels.fetch().catch(() => null)
        }

        const guildData = await client.models.guilds.findOne({ id: process.env.MAIN_GUILD });

        if (!guildData) {
            console.log(`\n\n\n` + `The bot has not been setup! Run !setup in your modmail server to setup the bot.`.red + `\n\n\n`);
        }

        console.log(`[PLUGINS]`.yellow + ` Loading plugins...`);
        
        if (guildData?.installed_plugins?.length > 0) {
            guildData.installed_plugins.forEach(plugin => {
                let pluginFile;

                if (existsSync(join(__dirname, `../plugins/${plugin.name}.js`))) {
                    pluginFile = require(`../plugins/${plugin.name}.js`)
                } else {
                    readdirSync(join(__dirname, `../plugins`)).forEach(file => {
                        if (!file.endsWith('js')) return;
                        const pluginName = require(`../plugins/${file}`)['plugin'].name;
                        if (pluginName === plugin.name) {
                            pluginFile = require(join(__dirname, `../plugins/${file}`));
                        }
                        
                        renameSync(join(__dirname, `../plugins/${file}`), join(__dirname, `../plugins/${plugin.name}.js`), () => null);
                    });
                }

                // pluginFile = require(`../plugins/${plugin.name}.js`);

                for (const command of Object.keys(pluginFile).filter(i => i !== 'plugin')) {
                    let cmd = pluginFile[command]
                    if (!client.commands.get(cmd.name)) {
                        client.commands.set(cmd.name, cmd);
                    }
                }
            })

            console.log(`\n\n[PLUGINS] Successfully loaded plugins -\n${guildData.installed_plugins.map(plugin => `     • ${plugin.name}`).join('\n')}\n\n`.yellow);
        } else {
            console.log(`[PLUGINS]`.yellow + ` No plugins found - skipping`);
        }

        console.log(`[READY]`.green + ` Logged in as ${client.user.tag}`);
    }
}

module.exports = ReadyEvent;
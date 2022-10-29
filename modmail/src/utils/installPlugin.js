const { get } = require("axios");
const { writeFileSync, rename, unlinkSync, existsSync, renameSync } = require('fs');
const { join } = require("path");
const colors = require('colors');

module.exports.installPlugin = async (client, message, guildData, link) => {
    let code;
    
    try {
        code = await get(link, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            }
        });
    } catch (e) {
        console.log(`[PLUGIN]`.red + ` Failed to install plugin ${link}.`);
        return client.embeds.error({
            message: message,
            options: {
                error: `Failed to install plugin \`\`${link}\`\`! Do you have the correct github link?.`
            }
        })
    }

    code = atob(code.data.content);
    const pluginInfo = eval(`${code}; module.exports['plugin']`)
    if (!pluginInfo || !pluginInfo.name) return client.embeds.error({
        message: message,
        options: {
            error: `Invalid plugin provided.`
        }
    });
    const pluginName = pluginInfo.name

    console.log(`[PLUGIN]`.yellow + ` Installing plugin ${pluginName}...`);

    await writeFileSync(join(__dirname, `../plugins/${pluginName}.js`), code)

    const plugin = require(`../plugins/${pluginName}.js`);
    const commands = Object.keys(plugin).filter(key => key !== 'plugin');
    const pluginConfig = plugin['plugin'];

    if (!pluginConfig.name || !pluginConfig.description || !pluginConfig.author || !pluginConfig.repository) {
        console.log(`[PLUGIN]`.yellow + ` Plugin ${pluginName} is missing required fields in the plugin config. Aborting...`);

        unlinkSync(join(__dirname, `../plugins/${pluginName}.js`));
        return client.embeds.error({
            message: message,
            options: {
                error: `The plugin you are trying to install is missing some required information. If you're the plugin author, please ensure your plugin has all of the following, otherwise please contact the plugin author -\n${[ 'name', 'description', 'author', 'repository' ].map(i => i).join('\n> ')}.`
            }
        })
    }

    const pluginCmds = [];

    for (const command of commands) {
        let cmd = plugin[command]
        if (!client.commands.get(cmd.name)) {
            client.commands.set(cmd.name, cmd);
        }
        pluginCmds.push({
            name: cmd.name,
            description: cmd.description
        })
    }

    if (!guildData.installed_plugins.find(i => i.name === pluginName)) {
        guildData.installed_plugins.push({
            name: pluginConfig.name,
            author: pluginConfig.author,
            link: link.replace(/api\.|repos\/|contents\//g, ''),
            commands_added: pluginCmds
        })
        
        await guildData.markModified('installed_plugins');
        await guildData.save();
        
        console.log(`[PLUGIN]`.green + ` ${pluginConfig.name} has been installed by ${message.author.tag}`)
        return client.embeds.success({
            message: message,
            options: {
                title: `Plugin "${pluginConfig.name}" installed successfully`,
                description: `Successfully installed the \`\`${pluginConfig.name}\`\` plugin from **${pluginConfig.author}**!\n\nThe following commands have been installed in the bot:\n${pluginCmds.map(cmd => `> • **${cmd.name}** - ${cmd.description}`).join('\n')}`,
                footer: { text: `Developer's note - not all plugins may work as intended, as the majority are likely made by independent developers. See !plugins help for information on plugins` }
            }
        })
    } else {
        let dbPlugin = guildData.installed_plugins.find(i => i.name === pluginName);

        dbPlugin.commands_added = pluginCmds

        await guildData.markModified('installed_plugins');
        await guildData.save();

        console.log(`[PLUGIN]`.green + ` ${pluginConfig.name} has been updated by ${message.author.tag}`)
        return client.embeds.success({
            message: message,
            options: {
                title: `Plugin "${pluginConfig.name}" updated successfully`,
                description: `Successfully updated the \`\`${pluginConfig.name}\`\` plugin from **${pluginConfig.author}**!\n\nThe following commands have been updated in the bot:\n${pluginCmds.map(cmd => `> • **${cmd.name}** - ${cmd.description}`).join('\n')}`,
                footer: { text: `Developer's note - not all plugins may work as intended, as the majority are likely made by independent developers. See !plugins help for information on plugins` }
            }
        })
    }
}
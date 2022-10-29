require('dotenv').config();

const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = async () => {
    const cmdMap = new Map();

    readdirSync(join(__dirname, 'src/commands')).forEach(folder => {
        readdirSync(join(__dirname, `src/commands/${folder}`)).forEach(file => {
            const Command = require(join(__dirname, `src/commands/${folder}/${file}`));
            const command = new Command();
            cmdMap.set(command.name, command);
        })
    })

    const cmdArray = [...cmdMap].map(([name, value]) => (name, value));
    const filteredCmds = cmdArray.filter(cmd => cmd.type !== 'TEXT');
    filteredCmds.forEach(cmd => delete cmd.type && delete cmd.category && delete cmd.cooldown);
    const slashCmds = filteredCmds.map(obj => obj);
    
    const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);
    
    // check if the SLASH_COMMANDS environment variable is true, if so, register the commands, if not, set the commands to an empty array
    if (process.env.SLASH_COMMANDS === 'true') {
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: slashCmds },
                );
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    } else {
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: [] },
                );
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
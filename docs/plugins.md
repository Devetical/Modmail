# Modmail - Plugins
Arguably one of my favorite features I've been able to implement into this bot has been plugins. Plugins are a way for users to add a github token to their bot instance and load custom features into the bot from github repositories, which are stored in the ``src/plugins`` folder. Instructions on how to develop and install plugins can be found on this page.

**P.S:** Towards the bottom of the page, you can view information on verified plugins and how to add yours to the mix!

## __Plugin Development__
Every plugin requires 2 different parts within ``module.exports`` - a plugin information object containing information about the plugin, and an individual exported object for each command. An example plugin is below -
```js
module.exports.plugin = {
    name: 'add',
    description: 'Add numbers together',
    author: 'Dan Perkins (Aesth3tical)',
    repository: 'https://github.com/Aesth3tical/MM-Plugins-Priv/blob/main/add/plugin.js'
}

module.exports.add = {
    name: 'add',
    description: 'Add the provided arguments as numbers',
    run: async ({ client, message, args }) => {
        let sum = 0;

        for (const arg of args) {
            sum += parseInt(arg)
        }

        message.reply({ content: `The sum is ${sum}!` })
    }
}

```

Plugin commands can access the following functions through the ``client`` passed through the command's run function -
> - ``client.isThread(client, message)`` - Returns true or false based on whether a message is sent in a thread
> - ``client.handleUserMessage(client, message, guildData, userData)`` - Called when a user DMs the bot, by default creates a thread or sends the user's message to their existing thread if one exists
> - ``client.handleStaffMessage(client, message, args, anonymous)`` - Called to handle messages sent by staff in threads
> - ``client.handleThreadSubscription(client, message, operation)`` - Called to handle thread subscriptions
> - ``client.handleThreadAlert(client, message, operation)`` - Called to handle thread alerts
> - ``client.handleThreadClose(client, message, guildData)`` - Called when a thread is closed

Plugin command functions parameter reference -
> - ``client`` - Discord.js client passed to the function
> - ``message`` - Message instance passed to the function
> - ``guildData`` - Object containing guild data the from the database
> - ``userData`` - Object containing user data from the database
> - ``anonymous`` - true/false whether the staff message should reveal the identity of the staff member sending it
> - ``operation`` - "add" or "remove" whether the subscription/alert should be removed

### __Example__ - Plugin to add !hold command to bot
```js
module.exports.plugin = {
    name: 'hold',
    description: 'Plugin to add commands to the bot',
    author: 'John Doe (JohnDoe)',
    repository: 'https://github.com/JohnDoe/modmail-plugins/hold/plugin.js'
}

module.exports.hold = {
    name: 'hold',
    description: 'Send a hold message to a user',
    run: async(client, message, args) => {
        return client.utils.handleStaffMessage(client, message, args)
    }
}
```

### __Managing Plugins__
*Developer's Note: Installing plugins **requires** a valid GitHub personal access token provided in your ``.env`` file. Unsure how to create one? [See this article](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)!*

**Installing Plugins**

To install plugins, simply copy the plugin URL and run the ``!plugins add <repo_link>``, replacing ``<repo_link>`` with your link. After the plugin successfully installs, an embed will be sent in the channel detailing the added features from the plugin

**Removing Plugins**

To remove an installed plugin, run ``!plugins list`` to view all installed plugins, followed by ``!plugins remove <plugin_name>`` replacing ``<plugin_name>`` with the name of the plugin from the list command.

## __Verified Plugins__

Verified plugins are plugins which have been confirmed to be working, free of malicious code and up-to-date. Plugin developers seeking verification must ensure their plugin meets the requirements listed below, if they do they may contact us via modmail in our [Discord server](https://discord.gg/gApddut58m).

Verified plugins can be found @ https://github.com/Devetical/Modmail-Plugins)
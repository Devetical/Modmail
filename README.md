# Modmail

This is a modmail bot written in Discord.js which features both non-anonymous and anonymous replies, snippets, logviewer functionalities (coming soon), **plugin support** and more!

![Modmail Thread](./docs/images/thread.png) ![Modmail Log](./docs/images/log.png)

### Installation

To install modmail and get it running on your system, it's as simple as 1, 2, 3.
1) Clone this repository ``git clone https://github.com/Devetical/Modmail``
2) Rename ``.env.example`` to ``.env`` and fill out the required parameters
3) Run ``npm run start`` to bring the bot online

**Note:** A couple of things required to setup the bot with certain configurations (i.e Logviewer/Plugins) require extra configuration details, which can be accessed at the following links -
> - Plugins - [GitHub](https://github.com) click your profile -> settings -> developer settings -> personal access tokens -> fine-grained tokens -> generate new token
> - Logviewer (oauth requirement) - [Discord Developer Portal](https://discord.com/developers/applications) click the bot application -> oauth2 -> reset secret -> add the new secret which appears to your .env
> - Logviewer (redirect) - [Discord Developer Portal](https://discord.com/developers/applications) click the bot application -> oauth2 -> Add a redirect

### Docs
- 🤖 Additional Configuration -> Moved to it's own bot command. Type ``!config help`` to get started
- 🛠️ [Plugins/Plugin Development](./docs/plugins.md)
- 💻 [Command List](./docs/commands.md)

### View the [Roadmap](./docs/roadmap.md) to stay up to date on the latest development updates!

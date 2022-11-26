const Command = require("../../classes/Command");

class Snippets extends Command {
    constructor() {
        super({
            name: 'snippets',
            description: 'Manage and send modmail snippets.\n\nNote: You can use the ``s`` and ``as`` commands to send snippets, with ``s`` being non-anonymous and ``as`` being anonymous.',
            usage: '{PREFIX}snippets <add|edit|delete|name> <name> <content>',
            category: 'management',
            aliases: [ 'snippet', 's', 'as' ]
        })
    }

    async run({ client, message, args, guildData, userData, cmd, cmdName }) {
        if (userData._id !== message.guild.ownerId && !guildData.managers.includes(userData._id)) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `You don't have the required bot permissions to configure snippets`,
                    userAuthor: true
                }
            })
        }

        const snippetcmd = args[0];

        if (!snippetcmd) return client.embeds.error({
            message: message,
            options: {
                error: `Please provide a subcommand command to run - \`\`add | edit | delete | snippet name to send\`\``,
                userAuthor: true
            }
        })

        const name = args[1];

        if (!['add', 'edit', 'delete'].includes(snippetcmd)) {
            const snippet = guildData.snippets.find(snippet => snippet.name === snippetcmd);

            if (!snippet) return client.embeds.error({
                message: message,
                options: {
                    error: `That snippet doesn't exist`,
                    userAuthor: true
                }
            })
        }

        const content = args.slice(2).join(' ');
        if (!content && [ 'add', 'edit' ].includes(snippetcmd)) return client.embeds.error({
            message: message,
            options: {
                error: `Please provide the content of the snippet you want to ${snippetcmd}`,
                userAuthor: true
            }
        })

        if (snippetcmd === 'add') {
            const snippet = await guildData.snippets.find(snippet => snippet.name === name);
            if (snippet) return client.embeds.error({
                message: message,
                options: {
                    error: `A snippet with the name \`\`${name}\`\` already exists`,
                    userAuthor: true
                }
            })

            const newSnippet = {
                name: name,
                content: content
            };

            await guildData.snippets.push(newSnippet);
            await guildData.save();

            return client.embeds.success({
                message: message,
                options: {
                    description: `Successfully created a snippet with the name \`\`${name}\`\``
                }
            })
        } else if (snippetcmd === 'edit') {
            const snippet = await guildData.snippets.find(snippet => snippet.name === name);
            if (!snippet) return client.embeds.error({
                message: message,
                options: {
                    error: `A snippet with the name \`\`${name}\`\` doesn't exist`,
                    userAuthor: true
                }
            })

            snippet.content = content;
            await guildData.markModified('snippets');
            await guildData.save();

            return client.embeds.success({
                message: message,
                options: {
                    description: `Successfully edited the snippet with the name \`\`${name}\`\``
                }
            })
        } else if (snippetcmd === 'delete') {
            const snippet = await guildData.snippets.find(snippet => snippet.name === name);
            if (!snippet) return client.embeds.error({
                message: message,
                options: {
                    error: `A snippet with the name \`\`${name}\`\` doesn't exist`,
                    userAuthor: true
                }
            })

            await guildData.snippets.splice(guildData.snippets.indexOf(snippet), 1);
            await guildData.save();

            return client.embeds.success({
                message: message,
                options: {
                    description: `Successfully deleted the snippet with the name \`\`${name}\`\``
                }
            })
        } else {
            const snippet = await guildData.snippets.find(s => s.name === snippetcmd);
            if (!snippet) return client.embeds.error({
                message: message,
                options: {
                    error: `A snippet with the name \`\`${name}\`\` doesn't exist`,
                    userAuthor: true
                }
            })

            let anon;
            if (cmdName === 'as') {
                anon = true;
            } else if (cmdName === 's') {
                anon = false;
            }

            return client.handleStaffMessage(client, message, snippet.content, anon, guildData);
        }
    }
}

module.exports = Snippets;
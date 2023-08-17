const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('export')
        .setDescription('Exports the guild it was executed in.'),
    execute: async ({client, interaction}) => {
        const guild = interaction.guild;
        const path = `/tmp/export.json`;

        guild.channels.fetch().then(async (channels) => {
            let messageList = [];
            let promises = [];

            channels.forEach(channel => {
                if (channel.isTextBased()) {
                    promises.push(channel.messages.fetch().then(messages => {
                        messages.forEach(message => {
                            messageList.push(message);
                        });
                    }));
                }
            });

            await Promise.all(promises);
            fs.writeFileSync(path, JSON.stringify(messageList));
        }).then(response => {
            interaction.user.send({
                files: [ path ]
            });
        });

        await interaction.reply('Please check your direct messages!');
    },
};
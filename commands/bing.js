const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName('bing').setDescription('Bing Chilling!'),
    async execute(interaction) {
        await interaction.reply('Bing Chilling 🍦 🥶');
    },
};

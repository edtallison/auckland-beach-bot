const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beach')
        .setDescription("Life's a beach!")
        .addStringOption((option) => option.setName('input').setDescription('The input to echo back').setRequired(true)),
    async execute(interaction) {
        const option = interaction.options.getString('input', true);
        await interaction.reply(`${option}`);
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName('fishing').setDescription('Check if today is an ideal fishing day'),
    async execute(interaction) {
        const ideal = 1 + Math.floor(Math.random() * 100); // 1 to 100 (inclusive)

        if (ideal < 50) {
            await interaction.reply('Today **is not** an ideal fishing day. <:193yywvl7rj41:931473656318668810>');
        } else {
            await interaction.reply('Today **is** an ideal fishing day! <:dreamCD:810112018606456857>');
        }
    },
};

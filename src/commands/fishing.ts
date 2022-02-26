const { SlashCommandBuilder } = require('@discordjs/builders');
import { Command } from '../types/Command';

export const command: Command = {
    data: new SlashCommandBuilder().setName('fishing').setDescription('Check if today is an ideal fishing day'),
    async execute(interaction) {
        const ideal = 1 + Math.floor(Math.random() * 100); // 1 to 100 (inclusive)

        if (ideal < 50) {
            await interaction.reply('Today **is not** an ideal fishing day.');
        } else {
            await interaction.reply('Today **is** an ideal fishing day!');
        }
    },
};

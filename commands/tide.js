const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { niwaKey } = require('../config.json');
const beaches = require('../beaches.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tide')
        .setDescription('Gets tide info using NIWA api')
        .addStringOption((option) => option.setName('beach-name').setDescription('Beach name').setRequired(true)),
    async execute(interaction) {
        const option = interaction.options.getString('beach-name', true);

        if (!beaches[option]) {
            await interaction.reply(`Invalid beach name`);
            return;
        }

        const lat = beaches[option][0];
        const long = beaches[option][1];

        console.log(lat);
        console.log(long);

        const tideData = await axios.get('https://api.niwa.co.nz/tides/data', {
            params: {
                lat: lat,
                long: long,
            },
            headers: {
                'x-apikey': niwaKey,
            },
        });
        let lastTideTime = new Date(tideData.data.values.pop().time);
        lastTideTime = lastTideTime.toTimeString();
        console.log(lastTideTime);
        await interaction.reply(`${option}\nLattitidue: ${lat}, Longitdue: ${long}\n${lastTideTime}`);
    },
};

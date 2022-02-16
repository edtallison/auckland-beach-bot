const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { niwaKey } = require('../config.json');
const beaches = require('../beaches.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tide')
        .setDescription('Gets tide info using NIWA api')
        .addStringOption((option) => option.setName('beach-name').setDescription('Enter the beach name').setRequired(true)),
    async execute(interaction) {
        const option = interaction.options.getString('beach-name', true);

        const inputFilter = new RegExp(/[^a-zA-Z0-9]/g);
        const input = option.replaceAll(inputFilter, '');

        if (!beaches[input]) {
            await interaction.reply(`Invalid beach name`);
            return;
        }

        const lat = beaches[input][0];
        const long = beaches[input][1];

        console.log(lat);
        console.log(long);

        const tideData = await axios.get('https://api.niwa.co.nz/tides/data', {
            params: {
                lat,
                long,
            },
            headers: {
                'x-apikey': niwaKey,
            },
        });

        let lastTideTime = new Date(tideData.data.values.pop().time); // hh:mm:ss format, 24 hour time

        formattedTime = lastTideTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        console.log(formattedTime);
        await interaction.reply(`${input}\nLattitidue: ${lat}, Longitdue: ${long}\n${formattedTime}`);
    },
};

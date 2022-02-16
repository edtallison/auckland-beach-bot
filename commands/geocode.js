const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { mapquestKey, niwaKey } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('geocode')
        .setDescription('Gets the coordinates of an address using the PositionStack Geocoding API')
        .addStringOption((option) => option.setName('input').setDescription('Address').setRequired(true)),
    async execute(interaction) {
        let option = interaction.options.getString('input', true);
        if (!option.includes('beach')) {
            option += ' beach';
        }

        const locationData = await axios.get('http://open.mapquestapi.com/geocoding/v1/address', {
            params: {
                key: mapquestKey,
                location: option,
            },
        });

        console.log(option);

        const locationResult = locationData?.data.results.shift();

        if (!locationResult) {
            await interaction.reply("Couldn't find location data");
            return;
        }

        const { lat, lng } = locationResult.locations.shift().displayLatLng;

        const tideData = await axios.get('https://api.niwa.co.nz/tides/data', {
            params: {
                lat: lat,
                long: lng,
            },
            headers: {
                'x-apikey': niwaKey,
            },
        });
        let lastTideTime = new Date(tideData.data.values.pop().time);
        lastTideTime = lastTideTime.toTimeString();
        console.log(lastTideTime);
        await interaction.reply(`${option}\nLattitidue: ${lat}, Longitdue: ${lng}`);
    },
};

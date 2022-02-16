const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { mapquestKey } = require('../config.json');

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

        const locationData = await axios.get(
            'http://open.mapquestapi.com/geocoding/v1/address',
            // 'http://open.mapquestapi.com/geocoding/v1/address?key=nHcBFhTvHtORVbVMH1dBs8apRK5G8xJM&location=titirangi%20beach'
            {
                params: {
                    key: mapquestKey,
                    location: option,
                },
            }
        );

        console.log(option);

        const locationResult = locationData?.data.results.shift();

        if (!locationResult) {
            await interaction.reply("Couldn't find location data");
            return;
        }

        //console.log(locationData.data.results[0]?.locations.shift().latLng);

        const { lat, lng } = locationResult.locations.shift().latLng;

        await interaction.reply(`${option}\nLattitidue: ${lat}, Longitdue: ${lng}`);
    },
};

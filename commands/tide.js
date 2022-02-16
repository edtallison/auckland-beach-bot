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

        // Get tide data from Tide API using coordinates from dictionary
        const tideData = (
            await axios.get('https://api.niwa.co.nz/tides/data', {
                params: {
                    lat,
                    long,
                },
                headers: {
                    'x-apikey': niwaKey,
                },
            })
        ).data.values;

        /*
        [
            {
                "time": "ISO string",
                "value": number
            }
        ] 

        becomes

        {
            "time": <DATEOBJECT>,
            "value": number,
        }
        */

        const formattedData = tideData.map(({ time, value }, i) => {
            let tideType;
            if (i == 0) {
                if (value < tideData[1].value) {
                    tideType = 'low';
                } else {
                    tideType = 'high';
                }
            } else {
                if (value < tideData[i - 1].value) {
                    tideType = 'low';
                } else {
                    tideType = 'high';
                }
            }
            console.log(value, tideType);
            return { time: new Date(new Date(time).getTime() + 1000 * 60 * 30), value, tideType };
        });

        //formattedTime = lastTideTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        const currentDate = new Date(); // in UTC, not local time
        console.log(currentDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = currentDate.getDate();

        const tomorrow = new Date(year, month, today + 1);
        console.log(tomorrow.toString()); // toString method converts it to local time

        const tomorrowsFirstTide = formattedData.find(({ time }) => time.getTime() >= tomorrow.getTime());
        console.log(
            `Tomorrows first tide (${tomorrowsFirstTide.time.toDateString()}) is at ${tomorrowsFirstTide.time.toTimeString()} (${
                tomorrowsFirstTide.tideType
            } tide)`
        );

        // console.log(formattedData);
        await interaction.reply(`${input}\nLattitidue: ${lat}, Longitdue: ${long}`);
    },
};

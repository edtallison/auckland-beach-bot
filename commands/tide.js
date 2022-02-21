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

        const formattedData = tideData.map(({ time, value }, i) => {
            let tideType;
            if (i == 0) {
                if (value < tideData[1].value) {
                    tideType = 'Low';
                } else {
                    tideType = 'High';
                }
            } else {
                if (value < tideData[i - 1].value) {
                    tideType = 'Low';
                } else {
                    tideType = 'High';
                }
            }
            return { time: new Date(new Date(time).getTime() + 1000 * 60 * 30), value, tideType }; // Add 30 minute offset
        });

        const currentDate = new Date(); // in UTC, not local time
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = currentDate.getDate();

        const tomorrow = new Date(year, month, today + 1).getTime();
        const dayAfterTomorrow = tomorrow + 1000 * 60 ** 2 * 24;

        let reply = [`Showing info for **${input}**`];

        const todaysTides = formattedData.filter(({ time }) => time.getTime() >= today && time.getTime() < tomorrow);

        reply.push([`\nTide times for today (${todaysTides[0].time.toDateString()})`]);

        for (const tide of todaysTides) {
            reply.push(
                `* ${tide.tideType} tide: ${tide.time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })}`
            );
        }

        const tomorrowsTides = formattedData.filter(
            ({ time }) => time.getTime() >= tomorrow && time.getTime() < dayAfterTomorrow
        );

        reply.push([`\nTide times for tomorrow (${tomorrowsTides[0].time.toDateString()})`]);

        for (const tide of tomorrowsTides) {
            reply.push(
                `* ${tide.tideType} tide: ${tide.time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                })}`
            );
        }

        await interaction.reply(reply.join('\n'));
    },
};

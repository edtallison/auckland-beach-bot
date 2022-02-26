const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('../config.json');

// based javascript
const commands = fs
    .readdirSync('./commands')
    .filter((file: string) => file.endsWith('.js'))
    .map((file: string) => require(`./commands/${file}`).data.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

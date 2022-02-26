import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import commands from './commands';

const { clientId, token, guildId } = require('../config.json');

export async function deployCommandsLocally() {
    const slashCommands = commands.map((command) => command.data().toJSON());

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });
    } catch (error) {
        console.log(error);
    }

    console.log(`Successfully registered ${slashCommands.length} application commands.`);
}

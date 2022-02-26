// Require the necessary discord.js classes etc
import fs from 'fs';
import { Client, Collection, Intents } from 'discord.js';
import { Command } from './types/Command';
import { join } from 'path';
import { deployCommandsLocally } from './deployCommands';
import commands from './commands';

const { token } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] }) as BeachBot;

client.once('ready', () => {
    console.log('Ready!');

    // if '--deploy' is detected in the CLI
    if (process.argv.slice(2).includes('--deploy')) {
        console.log('Deploying commands (local)...');
        // run command deploying script
        deployCommandsLocally();
    }
});

interface BeachBot extends Client {
    commands: Collection<string, Command>;
}

client.commands = new Collection();

// add each command (identified by name) to the collection
commands.forEach((command) => client.commands.set(command.data().name, command));

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Login to Discord with client's token
client.login(token);

import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deployCommands";
import { clearCommands } from "./deployCommands";

const guildId = "1241406342472667136";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", "GuildBans" ],
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.username}`);

    await clearCommands();
    
    await deployCommands( {guildId} );
});

/*
client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});
*/

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;

    
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);
import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deployCommands";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", "GuildBans"],
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.username}`);
    
    await deployCommands();
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
import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands() {//{ guildId }: DeployCommandsProps) {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
        Routes.applicationCommands(config.DISCORD_CLIENT_ID),
        {
            body: commandsData,
        }

        // if we wanna deploy to a certain guild

        //Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
        //{
        //  body: commandsData,
        //}
        
        );

        console.log("Successfully reloaded application (/) commands.");
        console.log("List of commands:\n");
        commandsData.forEach((command, i) => {
            console.log(`${i}: ${command.name}`);
        })
    } catch (error) {
        console.error(error);
    }
}

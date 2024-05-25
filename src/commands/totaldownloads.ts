import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("totaldownloads")
    .setDescription("Displays the total number of downloads for all mods.");

export async function execute(interaction: CommandInteraction) {
    try {
        const response = await fetch("https://thunderstore.io/c/bopl-battle/api/v1/package/");
        const data = await response.json();

        let totalDownloads = 0;

        data.forEach((mod: any) => {
            if (mod.name.toLowerCase() !== "bepinexpack") {
                mod.versions.forEach((version: any) => {
                    totalDownloads += version.downloads;
                });
            }
        });

        console.log('The total download count is: ' + totalDownloads)
        const formattedTotalDownloads = totalDownloads.toLocaleString();

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Total Downloads")
            .setDescription(`The total number of downloads for all mods is: **${formattedTotalDownloads}**`)
            .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error("Error fetching data:", error);
        interaction.reply("An error occurred while fetching data. Please try again later.");
    }
}

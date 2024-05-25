import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of available commands.");

export async function execute(interaction: CommandInteraction) {
    const helpEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Command List')
        .setDescription('Here is a list of available commands:')
        .addFields(
            { name: '/ping', value: 'Replies with Pong!' },
            { name: '/mods', value: 'Gets a list of all mods!' },
            { name: '/modstats', value: 'Gets the stats for a mod!' },
            { name: '/modmaker', value: 'Gets the stats for a modmaker!' },
            { name: '/kick', value: 'Kicks a user!' },
            { name: '/ban', value: 'Bans a user!' },
            { name: '/unban', value: 'Unbans a user!' },
        )
        .setTimestamp()

    interaction.reply({ embeds: [helpEmbed], ephemeral: true});
}

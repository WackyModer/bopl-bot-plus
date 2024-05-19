import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  //return interaction.reply("Pong!");
    interaction?.channel?.send('Pinging...').then(async sent => {
        //sent.edit(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
        var exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Pong!')
        .setDescription(`The ping is ${sent.createdTimestamp - interaction.createdTimestamp}ms!`)
        .setTimestamp()
        .setFooter({ text: 'Hello!' });
        await interaction.reply({ embeds: [exampleEmbed] });
        await sent.delete();
    });
}
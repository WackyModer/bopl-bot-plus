import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { logMessage } from "../log";

export const data = new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user")
    .addUserOption(option => 
      option.setName('userid')
        .setDescription('The ID of the user to unban')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('reason')
        .setDescription('why')
        .setRequired(true));

export async function execute(interaction: CommandInteraction) {
    //return interaction.reply("Pong!");

    // check perms
    if(!interaction.memberPermissions?.has('BanMembers')) {
        var failedEmbed = new EmbedBuilder()
        .setColor(0xee0000)
        .setTitle("Failure with command!")
        .setDescription(`<@${interaction.member?.user.id}>. You do not have the required perms to run this command and unban <@!${interaction.options.get("userid")?.user?.id}>.\nNice try.`)
        .setTimestamp()
        interaction.reply({ embeds: [failedEmbed] });

        logMessage("Someone tried to unban someone without perms...", [failedEmbed]);
        return;
    } else {
        try {
        interaction.guild?.members.unban(`${interaction.options.get("userid")?.user?.id}`, `${interaction.options.get("reason")?.value?.toString()}`);
        } catch {
            interaction.reply({ content:"Uh oh! The user id may not exist or they may not be banned!", ephemeral: true});
            return;
        }
        var unbanEmbed = new EmbedBuilder()
        .setColor(0x26da15)
        .setTitle("Success!")
        .setDescription(`<@${interaction.member?.user.id}> unbanned <@!${interaction.options.get("userid")?.user?.id}>.`)
        .setTimestamp()
        interaction.reply({ embeds: [unbanEmbed], ephemeral: true });

        logMessage("User unbanned!", [unbanEmbed]);
    }
}
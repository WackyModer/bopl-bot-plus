import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { logMessage } from "../log";

export const data = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user")
    .addUserOption(option => 
      option.setName('userid')
        .setDescription('The ID of the user to unban')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('reason')
        .setDescription('why')
        .setRequired(true));

export async function execute(interaction: CommandInteraction) {

    
    if(!interaction.memberPermissions?.has('KickMembers')) { 
        var failedEmbed = new EmbedBuilder()
        .setColor(0xee0000)
        .setTitle("Failure with command!")
        .setDescription(`<@${interaction.member?.user.id}>. You cannot kick <@!${interaction.options.get("userid")?.user?.id}>.\nNice try.`)
        .setTimestamp()
        interaction.reply({ embeds: [failedEmbed], ephemeral: true });

        logMessage("Someone tried to kick someone without perms...", [failedEmbed]);
        return;
    } else {
        try {
        interaction.guild?.members.kick(`${interaction.options.get("userid")?.user?.id}`, interaction.options.get("reason")?.value?.toString());
        } catch {
            interaction.reply({ content:"Uh oh! The user id may not exist or they may not be in this server!", ephemeral: true});
            logMessage(`Failed kick by <@!${interaction.user.id}>`);
            return;
        }

        var unbanEmbed = new EmbedBuilder()
        .setColor(0x26da15)
        .setTitle("Success!")
        .setDescription(`<@${interaction.member?.user.id}> kicked <@!${interaction.options.get("userid")?.user?.id}>.\nReason: ${interaction.options.get("reason")?.value?.toString()}`)
        .setTimestamp();
        interaction.reply({ embeds: [unbanEmbed] }).then(() => 
        setTimeout(() => {
            interaction.deleteReply()
        }, 5000)
        );

        logMessage("User kicked!", [unbanEmbed]);
    }
}
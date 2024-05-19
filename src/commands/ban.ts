import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { logMessage } from "../log";

export const data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user")
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
        .setDescription(`<@${interaction.member?.user.id}>. You cannot ban <@!${interaction.options.get("userid")?.user?.id}>.\nNice try.`)
        .setTimestamp()
        interaction.reply({ embeds: [failedEmbed] });

        logMessage("Someone tried to unban someone without perms...", [failedEmbed]);
        return;
    } else {
        try {
        interaction.guild?.members.ban(`${interaction.options.get("userid")?.user?.id}`, { "reason":  interaction.options.get("reason")?.value?.toString(), "deleteMessageSeconds": 0 });
        } catch {
            interaction.reply({ content:"Uh oh! The user id may not exist or they may be already banned!", ephemeral: true});
            return;
        }

        var unbanEmbed = new EmbedBuilder()
        .setColor(0x26da15)
        .setTitle("Success!")
        .setDescription(`<@${interaction.member?.user.id}> banned <@!${interaction.options.get("userid")?.user?.id}>.\n\nReason: ${interaction.options.get("reason")?.value?.toString()}`)
        .setTimestamp();
        interaction.reply({ embeds: [unbanEmbed] }).then(() => 
        setTimeout(() => {
            interaction.deleteReply()
        }, 5000)
        );

        logMessage("User banned!", [unbanEmbed]);
    }
}
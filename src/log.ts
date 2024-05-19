import { Embed, EmbedBuilder, TextChannel } from "discord.js";
import { config } from "./config"
import { client } from "./index";


export async function logMessage(content: string, embed?:EmbedBuilder[]) {
    const log_channel = client.channels.cache.get(config.LOG_CHANNEL_ID) as TextChannel;
    if(embed) {
        log_channel.send({ content: content, embeds: embed });
    } else {
        log_channel.send({ content: content });
    }
}
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, CommandInteractionOptionResolver } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("mods")
    .setDescription("Commands related to mods!")
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Lists all mods!'));

interface versionOBJ {
    name: string;
    full_name: string;
    description: string;
    icon: string;
    version_number: string;
    dependencies: string[];
    download_url: string;
    downloads: number;
    date_created: string;
    website_url: string;
    is_active: boolean;
    uuid4: string;
    file_size: number;
}

interface modOBJ {
    name: string;
    full_name: string;
    owner: string;
    package_url: string;
    date_created: string;
    date_updated: string;
    uuid4: string;
    rating_score: number;
    is_pinned: boolean;
    has_nsfw_content: boolean;
    categories: string[];
    versions: versionOBJ[];
}

var theMod: modOBJ;

export async function execute(interaction: CommandInteraction) {
    const inter = interaction.options as CommandInteractionOptionResolver;
    subCommandList[inter.getSubcommand(true)](interaction);
}

export async function list(interaction: CommandInteraction) {
    try {
        const response = await fetch("https://thunderstore.io/c/bopl-battle/api/v1/package/");
        const data: modOBJ[] = await response.json();

        let modList = "";
        const embedFields: { name: string, value: string }[] = [];

        data.forEach((item: modOBJ) => {
            if (item.categories.includes("Mods") && !item.categories.includes("Modpacks")) {
                if (modList.length + item.name.length + item.owner.length + 6 <= 1024) {
                    modList += `${item.name} by ${item.owner}\n`;
                }
            }
        });

        modList = modList.trim();

        embedFields.push({ name: 'Mods', value: modList || 'No mods found.' });

        const modEmbed = new EmbedBuilder()
            .setColor(0x32dbe2)
            .setDescription("## Current Mods")
            .addFields(embedFields)
            .setTimestamp();

        interaction.reply({ embeds: [modEmbed], ephemeral: true });

    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}


export const subCommandList: { [key: string]: (interaction: CommandInteraction) => void } = {
    list,
};

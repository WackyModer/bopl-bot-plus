import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("modstats")
    .setDescription("Gets the stats of any mod!")
    .addStringOption(option => 
        option.setName('modname')
        .setDescription('The name of the mod you\'re looking for.')
        .setRequired(true));

interface versionOBJ{
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

var theMod:modOBJ;

export async function execute(interaction: CommandInteraction) {
    //return interaction.reply("Pong!");

    try {
        const response = await fetch("https://thunderstore.io/c/bopl-battle/api/v1/package/");
    
        const data: modOBJ[] = await response.json();
        console.log(data);

        var theModExists:boolean = false;

        data.forEach((item: modOBJ) => {
            console.log(item.name);
            if(item.name.toLowerCase() == interaction.options.get("modname")?.value?.toString().toLowerCase()) {
                theMod = item;
                theModExists = true
                return;
            }
        });

    
        if(!theModExists) {
            interaction.reply({ content: "This mod doesn't exist! Are you typing the name correctly?", ephemeral: true});
            return;
        }

        

        console.log(theMod);
        console.log(theMod.versions);

        var totalModDownloads = 0 
        
        theMod.versions.forEach((ver: versionOBJ) => {
            totalModDownloads += ver.downloads;
        })

        var modEmbed = new EmbedBuilder()
        .setColor(0x32dbe2)
        .setDescription(`
        ## [${theMod.versions[0].name} ${theMod.versions[0].version_number}](${theMod.package_url})`) 
        /*
        ${theMod.versions[0].description}

        Downloads: ${totalModDownloads}
         */
        .addFields(
            { name: 'Description', value: theMod.versions[0].description },
            //{ name: '\u200B', value: '\u200B' },
            { name: 'Downloads', value: totalModDownloads.toString(), inline: true },
            { name: 'Author', value: theMod.owner , inline: true },
        )
        .setThumbnail(theMod.versions[0].icon)
        .setTimestamp()
        interaction.reply({ embeds: [modEmbed], ephemeral: true });

    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

// https://thunderstore.io/c/bopl-battle/api/v1/package/
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, CommandInteractionOptionResolver } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("modmaker")
    .setDescription("Commands related to data from the modmakers!")
    .addSubcommand(subcommand =>
        subcommand
            .setName('info')
            .setDescription('Gets the info of a modmaker')
            .addStringOption(option => 
                option.setName('name')
                .setDescription('The name of the mod maker you want info for. **check /modmaker list for valid people**')
                .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Lists all mod makers!'));
            
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
    // This is SO BAD but it works :sob:

    const inter = interaction.options as CommandInteractionOptionResolver;
    console.log(inter.getSubcommand(true));
    subCommandList[inter.getSubcommand(true)](interaction);
}

export async function info(interaction: CommandInteraction) {
    try {
        const response = await fetch("https://thunderstore.io/c/bopl-battle/api/v1/package/");
    
        const data: modOBJ[] = await response.json();
        console.log(data);


        var inputname = interaction.options.get("name")?.value?.toString();

        var userNameCapitalized = "";

        var foundEm = false;

        data.forEach((item: modOBJ) => {
            if(item.owner.toLowerCase() == inputname?.toLowerCase()) {
                userNameCapitalized = item.owner;
                foundEm = true;
            }
        });

        if(!foundEm) {
            interaction.reply({ content: "This modmaker doesn't seem to exist, did you check /modmaker list?", ephemeral: true });
            return;
        }


        var totalModDownloads = 0;
        var totalModsPublished = 0;
        var totalVersPublished = 0;
        var modNames: string[] = [];

        data.forEach((item: modOBJ) => {
            if(item.owner == userNameCapitalized) {

                modNames.push(item.name);

                totalModsPublished += 1
                item.versions.forEach((ver: versionOBJ) => {
                    totalVersPublished += 1;
                    totalModDownloads += ver.downloads;
                });
            }
        });

        var modString = "";

        modNames.forEach((item: string) => {
            modString = item + ", " + modString;
        })
        modString = modString.substring(0, modString.length - 2);


        
        var modEmbed = new EmbedBuilder()
        .setColor(0x32dbe2)
        .setDescription(`
        ## ${userNameCapitalized}'s mods!`) 
        /*
        ${theMod.versions[0].description}

        Downloads: ${totalModDownloads}
         */
        .addFields(
            { name: 'Total Downloads', value: totalModDownloads.toString() },
            { name: 'Total Mods', value: totalModsPublished.toString() },
            { name: 'Released mods', value: modString },
            { name: 'Total Released Versions', value: totalVersPublished.toString() },
        )
        .setTimestamp()
        interaction.reply({ embeds: [modEmbed], ephemeral: true });

    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }    
}

export async function list(interaction: CommandInteraction) {
    try {
        const response = await fetch("https://thunderstore.io/c/bopl-battle/api/v1/package/");
    
        const data: modOBJ[] = await response.json();
        console.log(data);

        var groupList: string[] = [];

        data.forEach((item: modOBJ) => {
            if(!groupList.includes(item.owner)) {
                if(item.categories.includes("Mods") && !item.categories.includes("Modpacks")) {
                    groupList.push(item.owner);
                }
            }
        });

        var modMakerList = ""

        groupList.forEach((item: string) => {
            modMakerList += item + "\n";
        })
        modMakerList = modMakerList.substring(0, modMakerList.length - 1); // so we dont have an extra \n at the end
        
        var modEmbed = new EmbedBuilder()
        .setColor(0x32dbe2)
        .setDescription(`
        ## Current Modmakers!`) 
        /*
        ${theMod.versions[0].description}

        Downloads: ${totalModDownloads}
         */
        .addFields(
            { name: 'ModMakers', value: modMakerList },
        )
        .setTimestamp()
        interaction.reply({ embeds: [modEmbed], ephemeral: true });

    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export const subCommandList: { [key: string]: (interaction: CommandInteraction) => void } = {
    info,
    list,
};

// https://thunderstore.io/c/bopl-battle/api/v1/package/
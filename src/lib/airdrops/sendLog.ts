
import { ChatInputCommandInteraction, EmbedBuilder, Routes, time, } from "discord.js";
import AirdropsManager from "./AirdropsManager";
import { AirdropType } from "../../schemas/Airdrop";


export default async function sendAirdropLogMessage(this: AirdropsManager, int: ChatInputCommandInteraction, airdrop: AirdropType) {
    const { client } = this;

    const duration = int.options.getString("duration")!;


    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("✈ `|` Se ha hecho un airdrop.")
        .addFields(
            {
                name: "Generado por",
                value: `\`${int.user.username}\` \`${airdrop.authorId}\``
            },
            {
                name: "Premio",
                value: `\`${airdrop.amount} ${airdrop.currency}\``
            },
            {
                name: "Tiempo",
                value: `\`${duration}\` ${time(new Date(airdrop.endAt), "R")}`
            },
            {
                name: "Servidor",
                value: `\`${int.guild!.name}\``
            }
        )
        .setTimestamp()

    client.user && embed.setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({
            size: 4096,
        }),
    })


    return client.rest.post(Routes.channelMessages(this.config.logChannelId), {
        body: {
            embeds: [embed.toJSON()]
        }
    })
}
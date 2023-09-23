import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageCreateOptions, userMention } from "discord.js";
import AirdropsManager from "./AirdropsManager";
import { AirdropType } from "../../schemas/Airdrop";

export function renderAirdropMessage(this: AirdropsManager, data: Omit<AirdropType, "_id">, participants?: string[]) {

    const isFinished = Date.now() >= data.endAt;

    const totalPersonsSize = participants?.length ?? 0;

    const currencyEmoji = this.getCurrencyEmoji(data.currency)

    const embed = new EmbedBuilder()
        .setTitle("✈ An airdrop appears")
        .setDescription(`<@${data.authorId}> left an airdrop of ${currencyEmoji} **${data.amount} ${data.currency}**`)
        .setColor("Red")
        .setFooter({ text: (isFinished ? `${totalPersonsSize} users joined, ended` : "Ends") })

    const messagePayload: MessageCreateOptions = { embeds: [embed], components: [] };

    if (isFinished) {
        embed.setTimestamp()

        if (participants) {
            if (totalPersonsSize === 0) embed.data.description += " has been collected by no one, there were no participants.!";
            else {

                const andOthersText = " and others..."
                const mentionLength = 24;
                const maxEmbedDescriptionLength = 2048;

                embed.data.description += ` has been collected by \n\n`;

                const maxMentions = Math.ceil((maxEmbedDescriptionLength - (embed.data.description + andOthersText).length) / mentionLength)

                embed.data.description += participants.slice(0, maxMentions).map(userMention).join(" ")

                if (participants.length > maxMentions) embed.data.description += andOthersText;
            };
        }

        return messagePayload;
    }

    embed.setTimestamp(data.endAt)

    messagePayload.components?.push(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(this.config.addParticipantButtonId)
                .setLabel("Enter airdrop")
                .setEmoji("🎉")
                .setStyle(ButtonStyle.Secondary)
        )
    )

    return messagePayload;
}
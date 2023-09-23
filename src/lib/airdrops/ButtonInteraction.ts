import { ButtonInteraction as btnInt } from "discord.js";
import AirdropsManager from "./AirdropsManager";
import { AddAirdropParticipantError } from "./AddParticipant";

export default async function ButtonInteraction(this: AirdropsManager, int: btnInt) {


    await int.deferUpdate();

    const airdropId = int.channelId + "/" + int.message.id;

    const isNewParticipant = await this.addAirdropParticipant(airdropId, int.user.id).catch((error) => {

        const replyMsg = {
            [AddAirdropParticipantError.UnknownUser]: ":x: `|` You are not registered, register with: </register:1121610579325485097>",
            [AddAirdropParticipantError.CannotParticipateInYourOwnAirdrop]: ":x: `|` You cannot participate in your own airdrop.",
        }[error as AddAirdropParticipantError]

        replyMsg && int.followUp({ content: replyMsg, ephemeral: true })

        return null
    })

    if (isNewParticipant === null) return;

    const replyMsg = {
        true: "✅ \`|\` You are now participating!.",
        false: ":x: \`|\` You were already participating."
    }[isNewParticipant.toString()]

    replyMsg && int.followUp({ content: replyMsg, ephemeral: true })
}


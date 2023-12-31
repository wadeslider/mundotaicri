import MundoBot from "../../structures/MundoBot";
import AddAirdropParticipant from "./AddParticipant";
import ButtonInteraction from "./ButtonInteraction";
import AirdropsCronManager from "./Cron";
import { renderAirdropMessage } from "./Message";
import AirdropEndMoneyAction from "./MoneyAction";
import createAirdrop from "./create";
import sendAirdropLogMessage from "./sendLog";

export default class AirdropsManager {

    config = {
        addParticipantButtonId: "adp.add.participant",
        cronCheckTime: 1000 * 60 * 60, // 1 hour,
        logChannelId: "1121836001216700426",
        cronDebug: false,
    }

    cron = new AirdropsCronManager(this)
    create = createAirdrop
    addAirdropParticipant = AddAirdropParticipant
    renderAirdropMessage = renderAirdropMessage
    airdropEndMoneyAction = AirdropEndMoneyAction
    sendLog = sendAirdropLogMessage
    ButtonInteraction = ButtonInteraction

    constructor(public client: MundoBot) {
        this.cron.loop()
    }

    getCurrencyEmoji(name: string) {
        return this.client.emojis.cache.find((emoji) => emoji?.name == name) ?? "❔";
    }
}
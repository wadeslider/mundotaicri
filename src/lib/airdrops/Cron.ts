
import { Routes } from "discord.js";
import AirdropsModel, { AirdropType } from "../../schemas/Airdrop.js";
import AirdropsManager from "./AirdropsManager.js";
import AirdropsParticipantsModel from "../../schemas/AirdropParticipant.js";



export default class AirdropsCronManager {

    /** airdrops will be ended in aprox 1 hour */
    cache = new Map<string, NodeJS.Timeout>();

    nextTimeToCheck?: number;

    constructor(public manager: AirdropsManager) {

    }

    async checkAirdrops() {

        this.nextTimeToCheck = Date.now() + this.manager.config.cronCheckTime;

        const products = await AirdropsModel.find({
            endAt: {
                $lt: this.nextTimeToCheck,
            }
        }).lean();

        for (const product of products) {
            this.append(product);
        }

    }

    append(airdrop: AirdropType) {

        const id = airdrop._id;

        if (this.nextTimeToCheck && airdrop.endAt > this.nextTimeToCheck) return;

        const diff = airdrop.endAt - Date.now();

        this.log(`Aidrops [Append]: id ${id} in ${diff}ms`);

        if (diff < 0) return this.endAirdrop(airdrop);

        this.remove(airdrop);

        this.cache.set(id, setTimeout(this.endAirdrop.bind(this, airdrop), diff))
    }

    /** remove timer from cache */
    remove(airdrop: AirdropType) {
        const id = airdrop._id;

        const TimeoutInCache = this.cache.get(id);

        TimeoutInCache && clearTimeout(TimeoutInCache);

        return Boolean(TimeoutInCache);
    }

    async endAirdrop(airdrop: AirdropType) {
        const id = airdrop._id;

        const { rest } = this.manager.client;

        const [channelId, messageId] = id.split("/");

        const participantsQuery = { airdropId: id };

        const [result, participants] = await Promise.all(
            [
                AirdropsModel.deleteOne({ messageId, channelId }),
                AirdropsParticipantsModel.find(participantsQuery).select("userId").lean().then(m => m.map((item) => item.userId))
            ]
        );

        await AirdropsParticipantsModel.deleteMany(participantsQuery)

        const messageData = this.manager.renderAirdropMessage(airdrop, participants);

        const toJSON = (array?: any[]) => array?.map(element => element.toJSON());

        rest.patch(Routes.channelMessage(channelId, messageId), {
            body: {
                embeds: toJSON(messageData.embeds),
                components: toJSON(messageData.components),
            }
        }).catch(() => null)

        this.manager.airdropEndMoneyAction(airdrop, participants)


        this.cache.delete(id);

        this.log(`Aidrops [End]: id ${id} result ${result.deletedCount > 0}`);

        return result.deletedCount > 0;
    }

    #timeout?: NodeJS.Timeout;

    working = false;

    async stop() {
        clearTimeout(this.#timeout);
        this.working = false;
    }

    async loop() {
        this.working = true;

        await this.checkAirdrops()

        this.#timeout = setTimeout(() => this.loop(), this.manager.config.cronCheckTime);
    }

    log(text: string) {
        this.manager.config.cronDebug && console.log(text);
    }
}
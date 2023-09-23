
import { ChatInputCommandInteraction } from "discord.js";
import AirdropsModel, { AirdropType } from "../../schemas/Airdrop.js";
import AirdropsManager from "./AirdropsManager";
import UserModel from "../../schemas/User";

export const enum AirdropCreateError {
    InsufficientCurrencyAmount,
    UnknownUser,
    UnknownCurrency,
}

export default async function createAirdrop(this: AirdropsManager, int: ChatInputCommandInteraction, data: Omit<AirdropType, "authorId" | "_id">) {

    const { globalBotId } = this.client;

    const [globalBotData, userData] = await Promise.all([
        await UserModel.findOne({ userId: globalBotId }).select("tokens").lean(),
        await UserModel.findOne({ userId: int.user.id }).lean(),
    ])


    if (!userData) throw AirdropCreateError.UnknownUser;

    if (globalBotData?.tokens[data.currency as any] === undefined) throw AirdropCreateError.UnknownCurrency;

    if ((userData.tokens[data.currency as any] ?? 0) < data.amount) throw AirdropCreateError.InsufficientCurrencyAmount;

    const baseData = { ...data, authorId: int.user.id };

    const msg = await int.channel!.send(this.renderAirdropMessage(baseData))




    const [AirdropData] = await Promise.all([
        AirdropsModel.create({
            ...baseData,
            _id: int.channelId + "/" + msg.id
        }),

        UserModel.updateMany({ userId: { $in: [int.user.id, globalBotId] } }, {
            $inc: {
                [`tokens.${data.currency}`]: -data.amount
            }
        }),
    ])

    this.cron.append(AirdropData);

    this.sendLog(int, AirdropData)

    return AirdropData;
}
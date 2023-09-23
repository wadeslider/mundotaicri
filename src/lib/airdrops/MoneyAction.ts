import { AirdropType } from "../../schemas/Airdrop";
import UserModel from "../../schemas/User";
import AirdropsManager from "./AirdropsManager";

export default async function AirdropEndMoneyAction(this: AirdropsManager, airdrop: AirdropType, participants: string[]) {

    const { globalBotId } = this.client;


    if (participants.length) {
        //dividir el dinero y repartirlo

        const cuantityForParticipants = airdrop.amount / participants.length;


        await Promise.all([

            UserModel.updateMany({
                userId: {
                    $in: participants,
                }
            }, {
                $inc: {
                    [`tokens.${airdrop.currency}`]: cuantityForParticipants
                }
            }),
            UserModel.updateOne({ userId: globalBotId }, {
                $inc: {
                    [`tokens.${airdrop.currency}`]: airdrop.amount
                }
            })
        ])

        return;
    }


    // No hay participantes, devolver el dinero a quien lo creó
    await UserModel.updateMany({ userId: { $in: [airdrop.authorId, globalBotId] } }, {
        $inc: {
            [`tokens.${airdrop.currency}`]: airdrop.amount
        }
    })

}
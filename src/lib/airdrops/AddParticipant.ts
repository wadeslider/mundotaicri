import AirdropsModel from "../../schemas/Airdrop";
import AirdropsParticipantsModel from "../../schemas/AirdropParticipant";
import UserModel from "../../schemas/User";

export const enum AddAirdropParticipantError {
    UnknownUser,
    CannotParticipateInYourOwnAirdrop,
}

export default async function AddAirdropParticipant(airdropId: string, userId: string) {

    const [userHasAccount, airdropData] = await Promise.all([
        UserModel.exists({ userId }).lean(),
        AirdropsModel.findById(airdropId).select("authorId").lean()
    ])

    if (userId === airdropData?.authorId) throw AddAirdropParticipantError.CannotParticipateInYourOwnAirdrop

    if (!userHasAccount) throw AddAirdropParticipantError.UnknownUser;

    const baseData = {
        userId,
        airdropId,
    }

    const AlreadyParticipant = await AirdropsParticipantsModel.exists(baseData);

    if (AlreadyParticipant) return false

    await AirdropsParticipantsModel.create(baseData);

    return true;
}
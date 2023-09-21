import { Schema, model, Document } from "mongoose";

interface IAirdropsParticipant extends Document {
    userId: string;
    airdropId: string;
}

const airdropsParticipantSchema = new Schema<IAirdropsParticipant>({
    userId: {
        type: String,
        required: true,
    },
    airdropId: {
        type: String,
        required: true,
    },
});

const AirdropsParticipantsModel = model<IAirdropsParticipant>("AirdropsParticipant", airdropsParticipantSchema);

export default AirdropsParticipantsModel;

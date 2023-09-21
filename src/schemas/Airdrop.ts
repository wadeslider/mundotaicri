import { Schema, model, Document } from "mongoose";

interface IAirdrop extends Document {
    _id: string;
    currency: string;
    endAt: number;
    authorId: string;
    amount: number;
}

const airdropSchema = new Schema<IAirdrop>({
    _id: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    endAt: {
        type: Number,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

const AirdropsModel = model<IAirdrop>("Airdrops", airdropSchema);

export default AirdropsModel;
import { InferSchemaType, Schema, model } from "mongoose";

const schema = new Schema({
    /**
     * channelId/messageId
     */
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
        required: true
    },
    authorId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
})

const AirdropsModel = model("Airdrops", schema)
export type AirdropType = InferSchemaType<typeof schema>;
export default AirdropsModel;
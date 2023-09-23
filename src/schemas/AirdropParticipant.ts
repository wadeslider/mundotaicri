import { Schema, model } from "mongoose";

const schema = new Schema({
    /** user's id */
    userId: {
        type: String,
        required: true,
    },
    airdropId: {
        type: String,
        required: true,
    },
})

const AirdropsParticipantsModel = model("AirdropsParticipant", schema)

export default AirdropsParticipantsModel;

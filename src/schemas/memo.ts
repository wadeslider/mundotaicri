import mongoose, { Schema, Document } from "mongoose";

interface IMemo extends Document {
    id: string;
    memo: number;
}

const memoSchema = new Schema<IMemo>({
    id: {
        type: String,
        required: true,
    },
    memo: {
        type: Number,
        required: true,
    },
});

const MemoModel = mongoose.model<IMemo>("memo", memoSchema);

export default MemoModel;

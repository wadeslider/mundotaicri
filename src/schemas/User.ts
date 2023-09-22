import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    memo: number;
    userId: string;
    hive: string;
    tokens: any[];
}

const userSchema = new Schema<IUser>({
    memo: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    hive: {
        type: String,
        required: true,
    },
    tokens: {
        type: Schema.Types.Mixed, 
        default: {}
    },
});

const UserModel = mongoose.model<IUser>("users", userSchema);

export default UserModel;

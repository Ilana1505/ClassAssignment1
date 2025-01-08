import mongoose from "mongoose";

export interface iUser {
    email: string;
    password: string;
    _id?: string;
}

const UserSchema = new mongoose.Schema<iUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model<iUser>('users', UserSchema);
export default UserModel;



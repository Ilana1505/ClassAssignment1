import mongoose from "mongoose";

export interface IUser {
    email: string;
    password: string;
    _id?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model<IUser>('users', UserSchema);
export default UserModel;



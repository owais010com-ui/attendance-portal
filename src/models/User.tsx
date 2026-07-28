import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    employeeId: string;
    designation: string;
    role: "admin" | "employee";
    isActive: boolean;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        employeeId: {
            type: String,
            required: true,
            unique: true,
        },

        designation: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model<IUser>("User", userSchema);

export default User;
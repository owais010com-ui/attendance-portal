import { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema(
    {
        adminName: {
            type: String,
            default: "",
        },

        adminEmail: {
            type: String,
            default: "",
        },

        adminPhone: {
            type: String,
            default: "",
        },

        companyName: {
            type: String,
            default: "",
        },

        companyEmail: {
            type: String,
            default: "",
        },

        companyAddress: {
            type: String,
            default: "",
        },

        officeStart: {
            type: String,
            default: "09:00",
        },

        officeEnd: {
            type: String,
            default: "18:00",
        },

        lateAfter: {
            type: String,
            default: "00:00",
        },
        
        workingHours: {
            type: Number,
            default: 8,
        },
    },
    {
        timestamps: true,
    }
);

export default models.Settings || model("Settings", SettingsSchema);
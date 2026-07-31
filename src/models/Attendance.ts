import { Schema, model, models } from "mongoose";

const attendanceSchema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
        },

        employeeName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        photo: {
            type: String,
            required: true,
        },

        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },

        locationLink: {
            type: String,
            required: true,
        },

        date: {
            type: String,
            required: true,
        },

        checkIn: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["Present", "Absent"],
            default: "Present",
        },
    },
    {
        timestamps: true,
    }
);

const Attendance =
    models.Attendance || model("Attendance", attendanceSchema);

export default Attendance;
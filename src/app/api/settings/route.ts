import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

// GET Settings
export async function GET() {
    try {
        await connectDB();

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        return NextResponse.json({
            success: true,
            settings,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: "Server Error",
        });
    }
}

// UPDATE Settings
export async function PUT(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(body);
        } else {
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                body,
                { new: true }
            );
        }

        return NextResponse.json({
            success: true,
            settings,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: "Server Error",
        });
    }
}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import User from "@/models/User";

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
                {
                    new: true,
                }
            );
        }
        
        if (
            body.adminName ||
            body.adminEmail ||
            body.adminPhone
        ) {
            await User.findOneAndUpdate(
                { role: "admin" },
                {
                    name: body.adminName,
                    email: body.adminEmail,
                    phone: body.adminPhone,
                }
            );
        }

        return NextResponse.json({
            success: true,
            settings,
            message: "Settings Updated Successfully",
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Server Error",
            },
            {
                status: 500,
            }
        );
    }
}
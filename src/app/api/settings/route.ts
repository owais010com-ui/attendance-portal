import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        await connectDB();

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        // Employee ko sirf attendance timing ki settings deni hain
        if (currentUser.role === "employee") {
            return NextResponse.json({
                success: true,
                settings: {
                    officeStart: settings.officeStart,
                    officeEnd: settings.officeEnd,
                },
            });
        }

        // Admin ko complete settings milengi
        if (currentUser.role === "admin") {
            return NextResponse.json({
                success: true,
                settings,
            });
        }

        return NextResponse.json(
            {
                success: false,
                message: "Access denied.",
            },
            {
                status: 403,
            }
        );
    } catch (error) {
        console.log("Get Settings Error:", error);

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

export async function PUT(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        if (currentUser.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Access denied. Admin only.",
                },
                {
                    status: 403,
                }
            );
        }

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
        console.log("Update Settings Error:", error);

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
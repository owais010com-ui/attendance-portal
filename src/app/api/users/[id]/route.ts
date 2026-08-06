import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        await connectDB();

        const { id } = await params;

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Employee not found",
                },
                {
                    status: 404,
                }
            );
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message: "Employee deleted successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Delete Employee Error:", error);

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

export async function PUT(
    req: Request,
    { params }: Params
) {
    try {
        await connectDB();

        const { id } = await params;

        const body = await req.json();

        const { employeeId } = body;

        if (!employeeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Employee ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                employeeId,
            },
            {
                new: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Employee not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Employee ID updated successfully",
                user: updatedUser,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Update Employee Error:", error);

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

export async function PATCH(
    req: Request,
    { params }: Params
) {
    try {
        await connectDB();

        const { id } = await params;

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Employee not found",
                },
                {
                    status: 404,
                }
            );
        }

        user.isActive = !user.isActive;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: user.isActive
                    ? "Employee Activated"
                    : "Employee Deactivated",
                isActive: user.isActive,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Toggle Status Error:", error);

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
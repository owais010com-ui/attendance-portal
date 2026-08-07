import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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

        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                users,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Get Users Error:", error);

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

// -----------------------------------------------------------------

export async function POST(req: Request) {
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

        const {
            name,
            email,
            password,
        } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, email and password are required.",
                },
                {
                    status: 400,
                }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already exists",
                },
                {
                    status: 400,
                }
            );
        }

        const employees = await User.find({
            role: "employee",
        }).select("employeeId");

        let maxNumber = 0;

        employees.forEach((emp) => {
            const match = emp.employeeId?.match(/^EMP(\d+)$/);

            if (match) {
                const num = Number(match[1]);

                if (num > maxNumber) {
                    maxNumber = num;
                }
            }
        });

        const employeeId = `EMP${String(maxNumber + 1).padStart(3, "0")}`;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            employeeId,
            role: "employee",
        });

        const userObject = user.toObject();

        delete userObject.password;

        return NextResponse.json(
            {
                success: true,
                message: "Employee Added Successfully",
                user: userObject,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Create User Error:", error);

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
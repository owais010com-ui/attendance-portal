import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
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
        await connectDB();

        const body = await req.json();

        const {
            name,
            email,
            password,
        } = body;

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
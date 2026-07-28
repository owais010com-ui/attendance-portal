import { connectDB } from "@/lib/db";

export default async function Home() {
  try {
    await connectDB();

    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-4xl font-bold text-green-500">
          ✅ MongoDB Connected
        </h1>
      </main>
    );
  } catch (error: any) {
    console.error("MongoDB Error:", error);

    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white p-10">
        <pre>{error.message}</pre>
      </main>
    );
  }
}
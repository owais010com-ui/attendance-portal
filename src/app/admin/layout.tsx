import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser() as { role?: string } | null;

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/unauthorized");

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

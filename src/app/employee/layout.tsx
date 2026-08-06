import { redirect } from "next/navigation";
import EmployeeLayoutClient from "@/components/employee/EmployeeLayoutClient";
import { getCurrentUser } from "@/lib/auth";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser() as { role?: string } | null;

  if (!user) redirect("/login");
  if (user.role !== "employee") redirect("/unauthorized");

  return <EmployeeLayoutClient>{children}</EmployeeLayoutClient>;
}

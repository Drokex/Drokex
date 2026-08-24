import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";

export default async function AdminLayout({ children }) {
  try {
    await requireAdminUser();
  } catch {
    redirect("/login");
  }

  return children;
}

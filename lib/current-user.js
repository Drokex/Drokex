import { getSessionFromCookies } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export async function getCurrentSession() {
  return await getSessionFromCookies();
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session?.userId) return null;
  return await getUserById(session.userId);
}

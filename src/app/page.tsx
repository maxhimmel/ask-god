import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/api/auth/signin");
  }

  redirect("/chat");
}

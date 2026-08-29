import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { isDevBypassEnabled } from "@/lib/env";

export default async function HomePage() {
  if (isDevBypassEnabled()) {
    redirect("/sign-in");
  }

  const { userId } = await auth();

  if (userId) {
    redirect("/hub");
  }

  redirect("/sign-in");
}

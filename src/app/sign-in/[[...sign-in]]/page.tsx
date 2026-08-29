import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ArcadeSignIn } from "@/components/arcade/arcade-sign-in";
import { DevArcadeSignIn } from "@/components/arcade/dev-auth-pages";
import { isDevBypassEnabled } from "@/lib/env";

export default async function SignInPage() {
  if (isDevBypassEnabled()) {
    return <DevArcadeSignIn />;
  }

  const { userId } = await auth();
  if (userId) redirect("/hub");

  return <ArcadeSignIn />;
}

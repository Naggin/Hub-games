import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ArcadeSignUp } from "@/components/arcade/arcade-sign-up";
import { DevArcadeSignUp } from "@/components/arcade/dev-auth-pages";
import { isDevBypassEnabled } from "@/lib/env";

export default async function SignUpPage() {
  if (isDevBypassEnabled()) {
    return <DevArcadeSignUp />;
  }

  const { userId } = await auth();
  if (userId) redirect("/hub");

  return <ArcadeSignUp />;
}

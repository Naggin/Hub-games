import { auth } from "@clerk/nextjs/server";

import { DEV_USER_ID, isDevBypassEnabled } from "@/lib/env";

export async function getAuthUserId() {
  if (isDevBypassEnabled()) {
    return DEV_USER_ID;
  }

  const { userId } = await auth();
  return userId;
}

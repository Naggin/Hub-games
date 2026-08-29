export function isClerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

export function isDevBypassEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    !isClerkConfigured() &&
    process.env.SKIP_AUTH !== "false"
  );
}

export const DEV_USER_ID = "dev_player_001";

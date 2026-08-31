export function isDevBypassEnabledClient() {
  return process.env.NEXT_PUBLIC_DEV_BYPASS === "true";
}

export function isClerkConfiguredClient() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
}

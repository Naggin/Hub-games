export function isDevBypassEnabledClient() {
  return process.env.NEXT_PUBLIC_DEV_BYPASS === "true";
}

import { redirect } from "next/navigation";

/** Old catalog route — Hub + Biblioteca are the same cabinet now. */
export default async function LibraryRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    genre?: string;
    monetization?: string;
  }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const key of ["q", "status", "genre", "monetization"] as const) {
    const value = params[key];
    if (value) qs.set(key, value);
  }
  redirect(qs.size ? `/hub?${qs.toString()}` : "/hub");
}

import { HubShell } from "@/components/layout/hub-shell";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HubShell>{children}</HubShell>;
}

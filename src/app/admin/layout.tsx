import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Private dashboard for The Impact Lab.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex min-h-screen flex-col field-deep">{children}</div>;
}

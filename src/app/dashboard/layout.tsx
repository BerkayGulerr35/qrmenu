import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/giris");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNav user={session.user} />
      <main className="pt-16">{children}</main>
    </div>
  );
}

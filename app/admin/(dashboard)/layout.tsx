import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const instant = false;

export const metadata = {
  title: "Admin CMS // Muhammed Shanid Portfolio",
  robots: "noindex, nofollow",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let userEmail: string | undefined = undefined;

  if (isConfigured) {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      redirect("/admin/login");
    }

    const ownerEmail = process.env.ADMIN_OWNER_EMAIL?.trim().toLowerCase();
    userEmail = user.email;

    if (ownerEmail && user.email?.trim().toLowerCase() !== ownerEmail) {
      return (
        <div className="min-h-screen bg-[#030303] text-[#F2F2F2] flex items-center justify-center p-6 font-mono text-center">
          <div className="max-w-md bg-[#0a0a0a] border border-red-500/40 p-8 space-y-4">
            <div className="text-red-400 font-bold text-lg">ACCESS DENIED</div>
            <p className="text-xs text-white/70">
              The authenticated account (<code>{user.email}</code>) does not match the configured owner email.
            </p>
            <a
              href="/admin/login"
              className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-xs uppercase"
            >
              Sign in with another account
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#F2F2F2] flex flex-col lg:flex-row font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar ownerEmail={userEmail} isConfigured={isConfigured} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {!isConfigured && (
          <div className="bg-amber-950/40 border-b border-amber-500/30 px-6 py-2.5 text-xs font-mono text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 animate-pulse" />
              <span>
                <strong>SETUP MODE ACTIVE:</strong> Supabase environment variables are pending in <code>.env.local</code>. CMS changes will run in mock demonstration mode.
              </span>
            </div>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Docs ↗
            </a>
          </div>
        )}

        <div className="p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

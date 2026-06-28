import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_CREDENTIALS } from "@/lib/config";
import { PainelNav } from "@/components/PainelNav";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
};

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  let isAdmin = false;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isAdmin = !!user?.email && user.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();
  } catch {}

  return (
    <>
      <PainelNav isAdmin={isAdmin} />
      {children}
    </>
  );
}

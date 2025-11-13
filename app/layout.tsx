import "./../styles/globals.css";
import type { ReactNode } from "react";
import { StorePersistence } from "./../components/StorePersistence";
import { AuthTimer } from "./../components/AuthTimer";
import { SupabaseSync } from "./../components/SupabaseSync";
import { lemonMilk } from "./fonts";

export const metadata = {
  title: "MyMap — Visited Countries",
  description: "Mark countries you have visited, tag them, and export a poster."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={lemonMilk.variable}>
      <body>
        <StorePersistence />
        <AuthTimer />
        <SupabaseSync />
        {children}
      </body>
    </html>
  );
}



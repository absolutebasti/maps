import "./../styles/globals.css";
import type { ReactNode } from "react";
import { StorePersistence } from "./../components/StorePersistence";
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
        {children}
      </body>
    </html>
  );
}



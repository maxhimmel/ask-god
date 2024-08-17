import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ask God",
  description: "Ask God anything",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <div className="bg-primary p-2">
            <div className="menu menu-horizontal menu-md rounded-full border-4 border-neutral bg-base-100 text-base-content">
              <li>
                <Link href="/">Ask</Link>
              </li>
              <li>
                <Link href="/chat">Chat</Link>
              </li>
            </div>
          </div>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}

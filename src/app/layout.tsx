import "./globals.css"; 
import { TopNavBar } from "./components/TopNavBar"; 
import { Analytics } from "@vercel/analytics/react";
import AuthSessionProvider from "./components/providers/AuthSessionProvider"; 
import StoreProvider from "./components/providers/StoreProvider"; 
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "OpenResume - Free Open-source Resume Builder and Parser",
  description:
    "OpenResume is a free, open-source, and powerful resume builder that allows anyone to create a modern professional resume in 3 simple steps. For those who have an existing resume, OpenResume also provides a resume parser to help test and confirm its ATS readability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthSessionProvider>
            <TopNavBar />
            {children}
            <Analytics />
          </AuthSessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
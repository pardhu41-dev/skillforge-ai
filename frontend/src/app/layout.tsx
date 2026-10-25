import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/auth/AppProviders";

export const metadata: Metadata = {
  title: "SkillForge AI",
  description: "AI-Powered Student Skill, Career & Continuous Development Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


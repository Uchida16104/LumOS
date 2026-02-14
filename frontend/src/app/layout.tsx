import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumOS - Universal Polyglot Operating System",
  description: "Next-generation web desktop environment with Lumos Language integration",
  keywords: ["LumOS", "Lumos Language", "Web OS", "Polyglot", "Programming Languages"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-black antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}

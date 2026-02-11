import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumOS - Universal Polyglot Operating System",
  description: "Next-generation web desktop environment with Lumos Language integration, supporting 100+ programming languages",
  keywords: ["LumOS", "Lumos Language", "Web OS", "Polyglot", "Programming Languages", "Compiler", "Interpreter"],
  authors: [{ name: "Hirotoshi Uchida" }],
  openGraph: {
    title: "LumOS - Universal Polyglot Operating System",
    description: "Browser-based OS with multi-language support",
    type: "website",
    url: "https://lumos-tawny-seven.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/htmx.org@1.9.10" defer></script>
        <script src="https://unpkg.com/alpinejs@3.13.5/dist/cdn.min.js" defer></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12" defer></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}

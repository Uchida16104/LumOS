import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumOS - Universal Polyglot Operating System",
  description: "Next-generation web desktop environment with Lumos Language integration, supporting 100+ programming languages",
  keywords: ["LumOS", "Lumos Language", "Web OS", "Polyglot", "Programming Languages", "Compiler", "Interpreter", "Terminal", "File System"],
  authors: [{ name: "Hirotoshi Uchida" }],
  openGraph: {
    title: "LumOS - Universal Polyglot Operating System",
    description: "Browser-based OS with multi-language support and Lumos Language integration",
    type: "website",
    url: "https://lumos-tawny-seven.vercel.app/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "LumOS Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LumOS - Universal Polyglot Operating System",
    description: "Browser-based OS with multi-language support",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=630&fit=crop"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#000000",
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

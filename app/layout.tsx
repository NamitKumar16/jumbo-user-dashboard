import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ActivityLogSidebar from "@/components/ActivityLogSidebar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "User Management Dashboard",
  description:
    "A modern internal dashboard built with Next.js, React Query, Radix UI, Zustand, and TailwindCSS.",
  keywords: [
    "user management",
    "dashboard",
    "internal tools",
    "Next.js",
    "React Query",
    "Radix UI",
    "Zustand",
    "TailwindCSS",
  ],
  openGraph: {
    title: "User Management Dashboard",
    description:
      "A modern internal dashboard built with Next.js, React Query, Radix UI, Zustand, and TailwindCSS.",
    url: "https://jumbo-user-dashboard-btlxrw0zl-namitkumar16s-projects.vercel.app/",
    siteName: "User Management Dashboard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "User Management Dashboard",
    description:
      "A modern internal dashboard built with Next.js, React Query, Radix UI, Zustand, and TailwindCSS.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
            <Navbar />
            <div className="px-4 py-6 sm:px-6 lg:px-10">
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  <main className="flex-1">{children}</main>
                  <ActivityLogSidebar />
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import Navbar from "@/components/Navbar";
import ActivityLogSidebar from "@/components/ActivityLogSidebar";
import Providers from "@/components/Providers";

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

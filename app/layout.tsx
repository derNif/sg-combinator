import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Sidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SG Combinator",
  description: "Accelerating innovation in St. Gallen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar />
            <main className="flex-1 w-full overflow-auto transition-all duration-300 ease-in-out">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next"
import { Inter, Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { cn } from "@/src/lib/utils";
import { Header } from "@/src/components/header"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Management",
  description: "Employee Records Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}     
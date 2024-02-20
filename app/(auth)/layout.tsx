import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import { dark } from "@clerk/themes";
import "../globals.css";

type AuthLayoutProps = {
  children: ReactNode
}

export const metadata = {
  title: 'Auth',
  description: ''
}

const inter = Inter({ subsets: ["latin"] });

const AuthLayout = ({children}: AuthLayoutProps) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang='en'>
        <body className={`${inter.className} bg-slate-800`}>
          <div className="w-full flex justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default AuthLayout

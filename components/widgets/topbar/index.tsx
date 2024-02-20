import { Logo } from "@/components/shared/ui/logo"
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export const TopBar = () => {
  return (
    <nav className="topbar">
      <Logo className="text-[23px]" />
      <div className="flex items-center">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer gap-3 p-4">
                <Image 
                  src="/assets/logout.svg"
                  alt="Logout"
                  width={24}
                  height={24}
                />
                <p className="text-light-2 max-lg:hidden">Выйти</p>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher 
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />
      </div>
    </nav>
  )
}

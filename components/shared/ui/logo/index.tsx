import Link from "next/link"

type LogoProps = {
  className?: string
}

export const Logo = ({className}: LogoProps) => {
  return (
    <Link 
        href="/"
        className={`flex items-center ${className}`}
      >
        <span className="font-semibold text-white">Chirp</span>
        <span className="font-semibold text-yellow-600">Chain</span>
    </Link>
  )
}

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-4xl font-bold text-center">
          Welcome to Weather App
      </h1>
      
      <div className="flex gap-4 w-screen justify-center">
        <Link href="/en" className="transition-transform hover:scale-110">
          <h2 className="text-sm text-center bg-[var(--color-primary)] border-2 border-[var(--color-text)] text-[var(--color-text)] outline-none shadow-custom-right-down p-2 hover:shadow-custom-right-down-hover transition-all duration-300">
            English
          </h2>
        </Link>

        <Link href="/es" className="transition-transform hover:scale-110">
          <h2 className="text-sm text-center bg-[var(--color-primary)] border-2 border-[var(--color-text)] text-[var(--color-text)] outline-none shadow-custom-right-down p-2 hover:shadow-custom-right-down-hover transition-all duration-300">
            Español
          </h2>
        </Link>

        <Link href="/pt" className="transition-transform hover:scale-110">
          <h2 className="text-sm text-center bg-[var(--color-primary)] border-2 border-[var(--color-text)] text-[var(--color-text)] outline-none shadow-custom-right-down p-2 hover:shadow-custom-right-down-hover transition-all duration-300">
            Português
          </h2>
        </Link>
      </div>
    </main>
  )
}
/**
 * PublicHeader component for public pages (landing, signin, signup)
 * Features: App name, theme toggle, profile icon
 */

'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function PublicHeader() {
  return (
    <header className=" border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Name - Left */}
          <Link
            href="/"
            className="text-xl font-bold font-montserrat text-foreground hover:text-primary transition-colors"
          >
            Todo App
          </Link>

          {/* Right Side - Theme Toggle + Profile Icon */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

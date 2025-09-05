'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Luxe Cleanings
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/booking">
              <Button variant="ghost">Book Service</Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost">Demo</Button>
            </Link>
            <Link href="/booking">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

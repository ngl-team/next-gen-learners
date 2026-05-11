'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-indigo-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-[#4F46E5] text-sm font-bold uppercase tracking-[0.1em] cursor-pointer hover:text-[#7C3AED] transition-colors duration-200">
              Next Generation Learners
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

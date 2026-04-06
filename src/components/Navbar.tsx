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
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/libraries" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              Library Programs
            </Link>
            <Link href="/after-school" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              After School
            </Link>
            <Link href="/woodstock" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              Woodstock
            </Link>
            <Link href="/superintendents" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              For Superintendents
            </Link>
            <Link href="/lesson-planner" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              Lesson Planner
            </Link>
            <Link href="/differentiation-engine" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              Differentiation
            </Link>
            <Link href="/student-feedback" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              Feedback
            </Link>
            <Link href="/parent-email" className="relative text-[#64748B] text-sm font-medium hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#4F46E5] after:scale-x-0 after:transition-transform after:duration-200 after:origin-center hover:after:scale-x-100">
              Parent Email
            </Link>
          </div>
          <div className="hidden md:block">
            <Link href="/libraries#book-a-program">
              <button className="btn-shimmer bg-[#10B981] text-white px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#059669] hover:shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:-translate-y-px transition-all duration-200">
                Book a Program
              </button>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-lg text-[#64748B] hover:text-[#4F46E5] hover:bg-indigo-50 cursor-pointer focus:outline-none transition-all duration-200">
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-indigo-100/50 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-1">
            <Link href="/libraries" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              Library Programs
            </Link>
            <Link href="/after-school" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              After School
            </Link>
            <Link href="/woodstock" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              Woodstock
            </Link>
            <Link href="/superintendents" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              For Superintendents
            </Link>
            <Link href="/lesson-planner" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              Lesson Planner
            </Link>
            <Link href="/differentiation-engine" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              Differentiation Engine
            </Link>
            <Link href="/student-feedback" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              Student Feedback
            </Link>
            <Link href="/parent-email" onClick={() => setIsOpen(false)} className="text-[#1E1B4B] hover:text-[#4F46E5] hover:bg-indigo-50 block px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200">
              Parent Email
            </Link>
            <div className="pt-4">
              <Link href="/libraries#book-a-program" onClick={() => setIsOpen(false)}>
                <button className="w-full btn-shimmer bg-[#10B981] text-white px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#059669] transition-all duration-200">
                  Book a Program
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

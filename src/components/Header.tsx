'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Calendar, DollarSign, Home } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Financial', href: '/financial', icon: DollarSign },
  ]

  return (
    <header className="p-6 flex justify-between items-center border-b border-[#3f4f4a] bg-[#1c2522]">
      <div className="flex items-center gap-4">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
            stroke="#d4af7a" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M15.9998 8.99993C15.9998 10.4713 15.1138 11.8347 13.8328 12.646C13.4578 12.8851 13.0248 13 12.5818 13H11.4178C10.9748 13 10.5418 12.8851 10.1668 12.646C8.88583 11.8347 7.99983 10.4713 7.99983 8.99993C7.99983 6.79079 9.79069 5 11.9998 5C14.2089 5 15.9998 6.79079 15.9998 8.99993Z" 
            stroke="#7a9e91" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M7.25 14.5C7.25 14.5 8.62 18 12 18C15.38 18 16.75 14.5 16.75 14.5" 
            stroke="#7a9e91" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <h1 className="text-2xl text-[#f0f5f3] font-serif">Sanctuary</h1>
          <p className="text-sm -mt-1 text-[#92a19c]">Dr. Evelyn Reed</p>
        </div>
      </div>
      <nav className="flex items-center gap-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 transition ${
                isActive
                  ? 'font-semibold border-b-2 border-[#d4af7a] pb-1 text-[#e0e8e5]'
                  : 'text-[#92a19c] hover:text-[#e0e8e5]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

'use client'

import { useState } from 'react'
import {
  Dumbbell,
  Home,
  Users,
  Calendar,
  DollarSign,
  ShoppingCart,
  Settings,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOutUser } from '@/modules/auth'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Members', path: '/dashboard/members', icon: Users },
    { name: 'Attendance', path: '/dashboard/attendance', icon: Calendar },
    { name: 'Payments', path: '/dashboard/payments', icon: DollarSign },
    { name: 'POS', path: '/dashboard/pos', icon: ShoppingCart },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings }
  ]

  return (
    <aside
      className={`bg-secondary sticky top-0 h-screen transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col p-4 shadow-lg`}
    >
      {/* Logo Section */}
      <div className="mb-8 flex items-center gap-3">
        <Dumbbell className="text-primary h-8 w-8" />
        {!isCollapsed && (
          <span className="text-primary text-2xl font-bold">GymOps</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-primary hover:text-primary/80 ml-auto"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                  pathname === item.path
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary/10 hover:text-primary text-gray-600'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <Button
          onClick={async () => await signOutUser(router)}
          variant="destructive"
          className={`${isCollapsed ? 'justify-center' : ''} w-full`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { actionSignOutUser } from '@/modules/auth'
import {
  ArrowLeft,
  ArrowRight,
  Book,
  Contact,
  DumbbellIcon,
  HomeIcon,
  LogOutIcon,
} from 'lucide-react'
import Link from 'next/link'
import { ReactElement, useState } from 'react'
import { toast } from 'sonner'

const navbarLinks: Array<{ label: string; link: string; icon: ReactElement }> =
  [
    {
      label: 'Home',
      link: '/dashboard',
      icon: <HomeIcon />,
    },
    {
      label: 'Members',
      link: '/dashboard/members',
      icon: <Contact />,
    },
    {
      label: 'Memberships',
      link: '/dashboard/memberships',
      icon: <Book />,
    },
  ]

export default function SidebarNav() {
  const [isExtended, setIsExtended] = useState<boolean>(false)

  const onClickLogoutUser = async () => {
    const ok = await actionSignOutUser()

    if (!ok) {
      toast.error('Error logging out')
      return
    }

    toast.success('Logged out successfully')
  }

  return (
    <aside
      className={`h-screen border p-3 ${isExtended ? 'w-[250px]' : 'w-[90px]'} bg-secondary relative`}
    >
      <div className="relative">
        <div className={`flex items-center justify-center gap-2`}>
          <DumbbellIcon size={30} />
          <p
            className={`${isExtended ? 'block' : 'hidden'} text-2xl font-bold`}
          >
            Gym Ops
          </p>
        </div>

        <Button
          className="absolute top-0 right-[-35]"
          onClick={() => setIsExtended(!isExtended)}
        >
          {isExtended ? <ArrowLeft /> : <ArrowRight />}
        </Button>
      </div>

      <nav className="mt-20">
        <ul className="flex flex-col gap-3">
          {navbarLinks.map((n, i) => (
            <li key={i}>
              <Link
                className={`hover:bg-primary hover:text-secondary flex w-full gap-2 rounded-md border p-3 ${isExtended ? '' : 'justify-center'}`}
                href={n.link}
              >
                {n.icon}
                <p className={`${isExtended ? 'block' : 'hidden'}`}>
                  {n.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute right-0 bottom-1 left-0 w-full p-2">
        <Button onClick={onClickLogoutUser} className="w-full">
          <LogOutIcon />
          <p className={`${isExtended ? 'block' : 'hidden'}`}>Logout</p>
        </Button>
      </div>
    </aside>
  )
}

import BottomMenu from '@/components/navbar/bottom-menu'
import AppSidebar from '@/components/navbar/sidebar/app-sidebar'
import TopMenu from '@/components/navbar/top-menu'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function AppLayout({children}:{children: React.ReactNode}) {
  return (
    <div>
        <SidebarProvider>
            <TopMenu/>
            <AppSidebar/>
            <main className='py-15 px-2 md:p-2 w-full overflow-y-auto'>{children}</main>
            <BottomMenu/>
        </SidebarProvider>
    </div>
  )
}

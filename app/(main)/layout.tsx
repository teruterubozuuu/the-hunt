import BottomMenu from '@/components/navbar/bottom-menu'
import AppSidebar from '@/components/sidebar/app-sidebar'
import TopMenu from '@/components/navbar/top-menu'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function AppLayout({children}:{children: React.ReactNode}) {
  return (
     <div className="flex h-dvh overflow-hidden">
        <SidebarProvider>
            <TopMenu/>
            <AppSidebar/>
            <main className='py-15 px-2 md:p-2 w-full flex-1 min-w-0 flex flex-col h-full overflow-hidden'>{children}</main>
            <BottomMenu/>
        </SidebarProvider>
    </div>
  )
}

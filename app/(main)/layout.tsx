import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function AppLayout({children}:{children: React.ReactNode}) {
  return (
    <div>
        <SidebarProvider>
            <AppSidebar/>
            <main className='p-2'>{children}</main>
        </SidebarProvider>
    </div>
  )
}

"use client";
import { menuItem } from '@/utils/app/constants'
import Link from 'next/link'
import React from 'react'
import UserDropdown from './sidebar/user-dropdown';

export default function BottomMenu() {
  return (
    <div className='md:hidden fixed bottom-0 w-full border-t-2 border-foreground p-2'>
        <div className='flex justify-around'>
            {menuItem.map((item)=>(
                <Link href={item.path} key={item.id}>{item.icon}</Link>
            ))}
        </div>
    </div>
  )
}

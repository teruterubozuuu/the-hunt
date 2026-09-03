"use client";
import { useActivePath } from '@/hooks/use-active-path';
import { cn } from '@/lib/utils';
import { menuItem } from '@/utils/app/constants'
import Link from 'next/link'

export default function BottomMenu() {
  const isActive = useActivePath();

  return (
    <div className='md:hidden fixed bottom-0 w-full border-t-2 border-foreground p-2 bg-white'>
        <div className='flex justify-around'>
            {menuItem.map((item)=>(
                <Link href={item.path} key={item.id}>
                  <div className='flex flex-col items-center'>
                    {isActive(item.path) ? item.filled : item.icon}
                    <span className={cn(`text-[8px]`, isActive(item.path) ? "font-semibold" : "")}>{item.label}</span>
                  </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function Loading() {
  return (
    <div className='flex justify-between'>
        <Skeleton className='h-screen w-20 rounded-md bg-muted-foreground'/>
    </div>
  )
}

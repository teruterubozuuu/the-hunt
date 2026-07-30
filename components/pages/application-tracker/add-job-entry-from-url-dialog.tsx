import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { LinkIcon } from '@phosphor-icons/react'
export default function AddJobEntryFromURL() {
  return (
    <Dialog>
      <DialogTrigger className="bg-primary p-2 text-primary-foreground rounded-md cursor-pointer" title='Add Job Entry from URL'>
        <LinkIcon weight='bold' size={13} />
      </DialogTrigger>
      <DialogContent>

      </DialogContent>
    </Dialog>
  )
}

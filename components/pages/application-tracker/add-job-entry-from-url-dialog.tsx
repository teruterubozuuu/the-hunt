import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription  } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { LinkIcon } from '@phosphor-icons/react'
export default function AddJobEntryFromURL() {
  return (
    <Dialog>
      <DialogTrigger className="bg-primary p-2 text-primary-foreground rounded-md cursor-pointer" title='Add Job Entry from URL'>
        <LinkIcon weight='bold' size={13} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Job URL</DialogTitle>
          <DialogDescription>Automatically enter a job entry by providing the job listing's URL</DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          name="jobUrl"
          id="jobUrl"
          placeholder="Type the link here..."
        />
        <Button className="cursor-pointer">Add Entry</Button>
      </DialogContent>
    </Dialog>
  )
}

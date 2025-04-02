import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface AddSoundModalProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isSubmitting: boolean
  newSoundUrl: string
  setNewSoundUrl: (value: string) => void
}

export function AddSoundModal({ onSubmit, isSubmitting, newSoundUrl, setNewSoundUrl }: AddSoundModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-border rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Add New Sound</DialogTitle>
          <DialogDescription>
            Enter a TikTok sound URL to track its metrics.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter TikTok sound URL"
              value={newSoundUrl}
              onChange={(e) => setNewSoundUrl(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Sound"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
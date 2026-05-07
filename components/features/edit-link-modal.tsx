'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { updateLinkAction } from '@/app/dashboard/actions';
import { cn } from '@/lib/utils';
import type { Link } from '@/db/schema';

interface EditLinkModalProps {
  link: Link;
}

export function EditLinkModal({ link }: EditLinkModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ url: link.url, shortCode: link.shortCode });

  function handleOpen() {
    setFormData({ url: link.url, shortCode: link.shortCode });
    setError(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const result = await updateLinkAction({ id: link.id, ...formData });

      if ('error' in result) {
        setError(result.error);
      } else {
        setOpen(false);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update the URL or short code for this link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shortCode">Short Code</Label>
              <Input
                id="edit-shortCode"
                type="text"
                placeholder="my-link"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                disabled={isPending}
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className={cn(isPending && 'opacity-50 cursor-not-allowed')}
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
import { Plus } from 'lucide-react';
import { createLinkAction } from '@/app/dashboard/actions';
import { cn } from '@/lib/utils';

export function CreateLinkModal() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ url: '', shortCode: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const result = await createLinkAction(formData);

      if ('error' in result) {
        setError(result.error);
      } else {
        setFormData({ url: '', shortCode: '' });
        setOpen(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Link
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Shortened Link</DialogTitle>
          <DialogDescription>
            Enter the URL you want to shorten and choose a custom short code.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortCode">Short Code</Label>
            <Input
              id="shortCode"
              type="text"
              placeholder="my-link"
              value={formData.shortCode}
              onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
              disabled={isPending}
              required
            />
          </div>
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
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
              {isPending ? 'Creating...' : 'Create Link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}

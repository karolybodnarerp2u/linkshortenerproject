import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserLinks } from '@/data/links';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { CreateLinkModal } from '@/components/features/create-link-modal';
import { EditLinkModal } from '@/components/features/edit-link-modal';
import { DeleteLinkDialog } from '@/components/features/delete-link-dialog';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const userLinks = await getUserLinks(userId);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your shortened links
                </p>
              </div>
              <CreateLinkModal />
            </div>
          </div>

          {userLinks.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                No links yet. Create your first shortened link to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userLinks.map((link) => (
                <Card key={link.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg truncate">
                          {link.shortCode}
                        </CardTitle>
                        <CardDescription className="mt-1 truncate">
                          {link.url}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit
                        </Button>
                        <EditLinkModal link={link} />
                        <DeleteLinkDialog link={link} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

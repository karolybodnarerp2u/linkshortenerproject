import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your shortened links</p>
          </div>
          
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">Your links will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}

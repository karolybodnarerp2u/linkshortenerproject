import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Link2, BarChart3, Zap, Shield, Globe, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroCTA } from '@/components/features/hero-cta';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  const features = [
    {
      icon: Zap,
      title: 'Instant Shortening',
      description:
        'Paste any long URL and get a clean, shareable short link in seconds.',
    },
    {
      icon: BarChart3,
      title: 'Click Analytics',
      description:
        'Track how many times your links are clicked and monitor their performance over time.',
    },
    {
      icon: Copy,
      title: 'Easy Sharing',
      description:
        'Copy your short link with one click and share it anywhere — social media, emails, or messages.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Your links are tied to your account. Only you can manage and delete them.',
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description:
        'Short links redirect instantly on any device, browser, or platform.',
    },
    {
      icon: Link2,
      title: 'Manage All Links',
      description:
        'View, copy, and delete all your shortened links from a single dashboard.',
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center md:py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Link2 className="size-3.5" />
            <span>Free link shortener for everyone</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Shorten links.
            <br />
            <span className="text-muted-foreground">Track what matters.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Turn long, unwieldy URLs into clean short links you can share anywhere.
            Monitor performance with built-in click analytics — all from one dashboard.
          </p>
        </div>
        <HeroCTA />
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Everything you need
            </h2>
            <p className="mt-3 text-muted-foreground">
              A simple, powerful toolkit for managing your links.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

'use client';

import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function HeroCTA(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
        <Button size="lg" className="h-11 px-8 text-base">
          Get Started Free
        </Button>
      </SignUpButton>
    </div>
  );
}

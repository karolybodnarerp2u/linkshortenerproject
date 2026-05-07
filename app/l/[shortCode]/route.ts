import { NextResponse } from 'next/server';
import { getLinkByShortCode } from '@/data/links';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
): Promise<NextResponse> {
  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.redirect(link.url, { status: 301 });
}

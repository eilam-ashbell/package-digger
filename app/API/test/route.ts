import npm from '@/utils/npm'
import { log } from 'console';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const latest = await npm.getPackageVersions('random');
    log(latest)

    return NextResponse.json(latest);
  }

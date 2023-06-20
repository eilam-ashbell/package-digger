import downloads from '@/utils/downloads';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const name = request.nextUrl.searchParams.get('name').toLowerCase();
    const version = request.nextUrl.searchParams.get('version');
    const scope = request.nextUrl.searchParams.get('scope').toLowerCase() as
        | 'all'
        | 'direct'
        | 'indirect'
        | 'dev';
    const deps = await request.json();

    const pkgDir = await downloads.downloadPkgs(name, version, deps, scope);
    const zipDir = await downloads.zipDir(pkgDir);    
    return NextResponse.json({zipDir});
}

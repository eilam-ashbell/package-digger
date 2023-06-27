import downloads from '@/utils/downloads';
import fs from 'fs';
import { NextRequest } from 'next/server';
import { parse } from 'url';

export async function POST(req: NextRequest) {
    // isolate search params of request url
    const { search } = parse(req.url, true);
    const params = new URLSearchParams(search);
    const name = params.get('packageName');
    const version = params.get('version');
    const scope = params.get('scope') as 'all' | 'direct' | 'indirect' | 'dev';
    // get all deps of the version from the request body
    const deps = await req.json();
    // download all the packages
    const pkgDir = await downloads.downloadPkgs(name, version, deps, scope);
    // compress all downloaded packages to zip file
    const zipDir = await downloads.zipDir(pkgDir);
    // response zip file
    const zipBuffer = fs.readFileSync(zipDir);
    return new Response(zipBuffer, {
        status: 200,
        headers: {
            'Content-type': 'application/zip',
            'Content-Disposition': `attachment; filename=${name}-${scope}.zip`,
        },
    });
}

import VersionFullModel from '@/models/version-full-model';
import convert from '@/utils/convert';
import depsDev from '@/utils/depsDev';
import npm from '@/utils/npm';
import osv from '@/utils/osv';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs'

export async function GET(
    request: NextRequest,
    { params }: { params: { packageName: string; version: string } },
) {
    const packageName = convert.url(params.packageName);
    const npmVersionInfo = await npm.getVersionInfo({
        name: packageName,
        version: params.version,
    });
    const depsDevVersionInfo = await depsDev.getVersion(
        packageName,
        'NPM',
        params.version,
    );
    const depsDevDependencies = await depsDev.getDependencies(
        packageName,
        'NPM',
        params.version,
    );
    const vulnerabilities = await osv.getVulns(`pkg:npm/${npmVersionInfo._id}`);
    const directDeps = npmVersionInfo.dependencies
        ? Object.fromEntries(
              Object.entries(npmVersionInfo.dependencies).map((d) => [
                  d[0],
                  d[1].replace(/^[^\d]+/, '').split(' ')[0],
              ]),
          )
        : null;
    const devDeps = npmVersionInfo.devDependencies
        ? Object.fromEntries(
              Object.entries(npmVersionInfo.devDependencies).map((d) => [
                  d[0],
                  d[1].replace(/^[^\d]+/, '').split(' ')[0],
              ]),
          )
        : null;
    const data = new VersionFullModel();
    const indirect = depsDevDependencies.nodes
        .filter((d) => d.relation === 'INDIRECT')
        .map((d) => [[d.versionKey.name], d.versionKey.version]);

    const dep = Object.fromEntries(indirect);              
    data.name = convert.fromUrl(npmVersionInfo.name) || null;
    data.tag = params.version || null;
    data.fullName = npmVersionInfo._id || null;
    data.ecosystem = 'npm' || null;
    // data.description = npmVersionInfo.description || null;
    // data.contributors = npmVersionInfo.contributors || null;
    data.dist = {
        integrity: npmVersionInfo.dist.integrity || null,
        shasum: npmVersionInfo.dist.shasum || null,
        tarball: npmVersionInfo.dist.tarball || null,
        fileCount: npmVersionInfo.dist.fileCount || null,
        unpackedSize: npmVersionInfo.dist.unpackedSize || null,
        signatures: npmVersionInfo.dist.signatures || null,
        // ...npmVersionInfo.dist,
        engine: npmVersionInfo.engines || null,
    };
    data.publishedAt = depsDevVersionInfo.publishedAt || null;
    data.isDefault = depsDevVersionInfo.isDefault || null;
    data.advisoryKeys = depsDevVersionInfo.advisoryKeys || null;
    data.dependencies = {
        direct: directDeps || null,
        dev: devDeps || null,
        indirect: dep || null,
        count: {
            direct: npmVersionInfo.dependencies
                ? Object.keys(npmVersionInfo.dependencies).length
                : 0,
            dev: npmVersionInfo.devDependencies
                ? Object.keys(npmVersionInfo.devDependencies).length
                : 0,
            indirect: dep ? Object.keys(dep).length : 0,
        },
    };
    data.vulnerabilities = {
        vulns: vulnerabilities || [],
    };
    fs.writeFile("versionInfo.json", JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
        }
    });
    return NextResponse.json({ ...data });
}

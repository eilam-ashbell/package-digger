import VersionFullModel from "@/models/version-full-model";
import depsDev from "@/utils/depsDev";
import npm from "@/utils/npm";
import osv from "@/utils/osv";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { packageName: string; version: string } }
) {
    const npmVersionInfo = await npm.getVersionInfo({
        name: params.packageName,
        version: params.version,
    });
    const depsDevVersionInfo = await depsDev.getVersion(
        params.packageName,
        "NPM",
        params.version
    );
    const depsDevDependencies = await depsDev.getDependencies(
        params.packageName,
        "NPM",
        params.version
    );
    const vulnerabilities = await osv.getVulns(`pkg:npm/${npmVersionInfo._id}`);
    const directDeps = npmVersionInfo.dependencies ? Object.fromEntries(Object.entries(npmVersionInfo.dependencies).map( d => [d[0], d[1].replace(/^[^\d]+/, '')])) : null
    const devDeps = npmVersionInfo.devDependencies ? Object.fromEntries(Object.entries(npmVersionInfo.devDependencies).map( d => [d[0], d[1].replace(/^[^\d]+/, '')])) : null
    const data = new VersionFullModel();
    const indirect = depsDevDependencies.nodes
        .filter((d) => d.relation === "INDIRECT")
        .map((d) => [[d.versionKey.name], d.versionKey.version]);

    const dep = Object.fromEntries(indirect);

    data.name = npmVersionInfo.name;
    data.tag = params.version;
    data.fullName = npmVersionInfo._id;
    data.ecosystem = "npm";
    data.description = npmVersionInfo.description;
    data.contributors = npmVersionInfo.contributors;
    data.dist = {
        ...npmVersionInfo.dist,
        engine: npmVersionInfo.engines,
    };
    data.publishedAt = depsDevVersionInfo.publishedAt;
    data.isDefault = depsDevVersionInfo.isDefault;
    data.advisoryKeys = depsDevVersionInfo.advisoryKeys;
    data.dependencies = {
        direct: directDeps,
        dev: devDeps,
        inDirect: dep,
        count: {
            direct: npmVersionInfo.dependencies
                ? Object.keys(npmVersionInfo.dependencies).length
                : 0,
            dev: npmVersionInfo.devDependencies
                ? Object.keys(npmVersionInfo.devDependencies).length
                : 0,
            inDirect: dep ? Object.keys(dep).length : 0,
        },
    };
    data.vulnerabilities = {
        vulns: vulnerabilities,
    };
    return NextResponse.json({ ...data });
}

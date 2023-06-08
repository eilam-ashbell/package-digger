import { PackageName } from "@/models/npm/package-name-model";
import DepsModel from "@/models/united/deps-model";
import depsDev from "./depsDev";
import npm from "./npm";
import VersionModel from "@/models/npm/version-model";
import git from "./git";
import AdoptionModel from "@/models/united/adoption-model";
import convert from "./convert";
import VersionInfoModel from "@/models/united/version-info-model";

async function getVersionInfo(packageName:string): Promise<VersionInfoModel> {
    const packageInfo = await npm.getPackageInfo(packageName, false)
    const currentVersion = packageInfo["dist-tags"].latest;
    const versions = Object.keys(packageInfo.versions)
    return {
        currentVersion: currentVersion,
        versions: versions,
        versionsCount: versions.length,
        lastPublish: new Date(Object.entries(packageInfo.time).pop()[1]),
        lastModified: new Date(packageInfo.time.modified),
        created: new Date(packageInfo.time.created)
    }
    
}
async function getDeps(packageInfo: PackageName): Promise<DepsModel> {
    const depsFromNpm = await npm.getVersionInfo(packageInfo);
    const depsFromDepsDev = await depsDev.getDependencies(
        packageInfo.name,
        "NPM",
        packageInfo.version
    );
    const unitedDeps = new DepsModel();
    unitedDeps.direct = depsFromNpm.dependencies;
    unitedDeps.dev = depsFromNpm.devDependencies;
    const indirect = depsFromDepsDev.nodes.filter(
        (d) => d.relation === "INDIRECT"
    );
    for (let d of indirect) {
        unitedDeps.indirect[d.versionKey.name] = d.versionKey.version;
    }
    return unitedDeps;
}

async function getAdoption(versionInfo: VersionModel) {
    const downloads = await npm.getPackageRangeDownloads(
        versionInfo.name,
        "last-month"
    );
    const [owner, repo] = convert.gitUrlToRepoParams(
        versionInfo.repository.url
    );
    const repoInfo = await git.getRepo(owner, repo);
    const popularity = new AdoptionModel({
        stars: repoInfo.stargazers_count || 0,
        forks: repoInfo.forks_count || 0,
        watchers: repoInfo.watchers_count || 0,
        network: repoInfo.network_count || 0,
        subscribers: repoInfo.subscribers_count || 0,
        openIssues: repoInfo.open_issues_count || 0,
        downloads: downloads,
    });
    return popularity;
}

export default {
    getDeps,
    getAdoption,
    getVersionInfo,
};

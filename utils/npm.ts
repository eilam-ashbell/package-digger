import AllPackagesModel from "@/models/npm/all-packages-model";
import DistTagsModel from "@/models/npm/dist-tags-model";
import LatestVersionModel from "@/models/npm/latest-version-model";
import PackageDownloadModel from "@/models/npm/package-download-model";
import PackageInfoModel from "@/models/npm/package-info-model";
import { PackageName } from "@/models/npm/package-name-model";
import PackageTimeModel from "@/models/npm/package-time-model";
import PackageVersionsDownloadsModel from "@/models/npm/package-versions-downloads-model";
import SearchPackageResultsModel from "@/models/npm/search-package-results-model";
import VersionModel from "@/models/npm/version-model";
import axios from "axios";

async function getAllPackages(): Promise<Omit<AllPackagesModel, "doc">> {
    const { data } = await axios.get<Omit<AllPackagesModel, "doc">>(
        `https://replicate.npmjs.com/_all_docs`
    );
    return data;
}

async function getAllPackagesInfo(): Promise<AllPackagesModel> {
    const { data } = await axios.get<AllPackagesModel>(
        `https://replicate.npmjs.com/_all_docs?include_docs=true`
    );
    return data;
}

async function getPackageInfo(
    packageName: string,
    abbr: boolean = true
): Promise<PackageInfoModel> {
    const reqConfig = {
        headers: {
            Accept: "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*",
        },
    };
    const { data } = await axios.get<PackageInfoModel>(
        `https://registry.npmjs.org/${packageName}`,
        abbr ? reqConfig : null
    );
    return data;
}

async function getVersionInfo(version: PackageName): Promise<VersionModel> {
    const { data } = await axios.get<VersionModel>(
        `https://registry.npmjs.org/${version.name}/${version.version}`
    );
    return data;
}

async function getPackageVersions(
    packageInfo: PackageInfoModel | string
): Promise<string[]> {
    if (typeof packageInfo === "string") {
        packageInfo = await getPackageInfo(packageInfo);
    }
    const versions = Object.keys(packageInfo.versions);
    return versions;
}

async function getPackageLatestVersion(
    packageName: string
): Promise<string> {
    const {data} = await axios.get<LatestVersionModel>(`https://registry.npmjs.org/${packageName}/latest`)
    const latest = data.version;
    return latest;
}

// async function getPackageLatestVersion(
//     packageInfo: PackageInfoModel | string
// ): Promise<string> {
//     if (typeof packageInfo === "string") {
//         packageInfo = await getPackageInfo(packageInfo);
//     }
//     const latest = packageInfo["dist-tags"].latest;
//     return latest;
// }

async function getPackageDownloadLink(
    versionInfo: VersionModel | PackageName
): Promise<string> {
    if (!(versionInfo instanceof VersionModel)) {
        versionInfo = await getVersionInfo(versionInfo);
    }
    const link = (versionInfo as VersionModel)?.dist?.tarball;
    return link;
}

async function getPackageDependencies(
    versionInfo: VersionModel | PackageName
): Promise<Pick<VersionModel, "dependencies" | "devDependencies">> {
    if (!(versionInfo instanceof VersionModel)) {
        versionInfo = await getVersionInfo(versionInfo);
    }
    const deps = {
        dependencies: (versionInfo as VersionModel).dependencies,
        devDependencies: (versionInfo as VersionModel).devDependencies,
    };
    return deps;
}

async function getPackageTimes(
    packageInfo: PackageInfoModel | string
): Promise<PackageTimeModel> {
    if (typeof packageInfo === "string") {
        packageInfo = await getPackageInfo(packageInfo, false);
    }
    const times = packageInfo.time;
    return times;
}

async function getPackageVersionsDownloads(
    packageName: string
): Promise<PackageVersionsDownloadsModel> {
    const { data } = await axios.get<PackageVersionsDownloadsModel>(
        `https://api.npmjs.org/versions/${packageName}/last-week`
    );
    return data;
}

async function getPackageRangeDownloads(
    packageName: string,
    timeRange:
        | "last-day"
        | "last-week"
        | "last-month"
        | `${number}${number}${number}${number}-${number}${number}-${number}${number}:${number}${number}${number}${number}-${number}${number}-${number}${number}`
): Promise<PackageDownloadModel> {
    const { data } = await axios.get<PackageDownloadModel>(
        `https://api.npmjs.org/downloads/range/${timeRange}/${packageName}`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }
    );
    return data;
}

async function getPackagePointDownloads(
    packageName: string,
    timeRange: "last-day" | "last-week" | "last-month"
): Promise<PackageDownloadModel> {
    const { data } = await axios.get<PackageDownloadModel>(
        `https://api.npmjs.org/downloads/point/${timeRange}/${packageName}`
    );
    return data;
}

async function searchPackageName(packageName: string): Promise<SearchPackageResultsModel[]> {
    const { data } = await axios.get<{"objects": SearchPackageResultsModel[]}>(`https://registry.npmjs.org/-/v1/search?text=${packageName}`)
    const packages = data.objects
    return packages;
}

export default {
    getAllPackages,
    getAllPackagesInfo,
    getPackageInfo,
    getVersionInfo,
    getPackageVersions,
    getPackageLatestVersion,
    getPackageDownloadLink,
    getPackageDependencies,
    getPackageTimes,
    getPackageVersionsDownloads,
    getPackageRangeDownloads,
    getPackagePointDownloads,
    searchPackageName,
};

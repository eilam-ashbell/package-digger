import AllPackagesModel from '@/models/npm/all-packages-model';
import DistTagsModel from '@/models/npm/dist-tags-model';
import LatestVersionModel from '@/models/npm/latest-version-model';
import PackageDownloadModel, { NpmPackagePointDownloadsModel, NpmPackageRangesDownloadsModel } from '@/models/npm/npm-package-download-model';
import PackageInfoModel from '@/models/npm/package-info-model';
import { PackageName } from '@/models/npm/package-name-model';
import PackageTimeModel, { FullPackageTimeModel } from '@/models/npm/package-time-model';
import PackageVersionsDownloadsModel from '@/models/npm/package-versions-downloads-model';
import SearchPackageResultsModel from '@/models/npm/search-package-results-model';
import NpmFullVersionModel from '@/models/npm/npm-full-version-model';
import axios from 'axios';
import depsDev from './depsDev';
import UnitedDepsModel from '@/models/united/deps-model';
import { ITimeRange } from '@/models/npm/ITimeRange';
import NpmPackageDataModel from '@/models/npm/npm-package-data-model';
import { PackageURL } from 'packageurl-js';
import convert from './convert';
import NpmUserPageData from '@/models/npm/npm-user-page-data';

// Get NPM page content data according to a package name and version
async function getPackagePageData(packageName: string, packageVersion?: string, scope?: string): Promise<NpmPackageDataModel> {
    try {
        const requestUrl = `https://www.npmjs.com/package/${scope ? scope + '/' : ''}${packageName}/${packageVersion ? 'v/' + packageVersion : ''}`        
        const { data } = await axios.get<NpmPackageDataModel>(requestUrl, {
            // this header define JSON response and not HTML page
            headers: {
                'x-spiferack': 1
            }
        })        
        return data;
    } catch (err) {
        console.log(err);
    }
}

// get npm user page data
async function getUserPageData(username: string, page?: number): Promise<NpmUserPageData> {

    const { data } = await axios.get(`https://www.npmjs.com/~${username}`, {
        params: {
            page: page || 0
        },
        // this header define JSON response and not HTML page
        headers: {
            'x-spiferack': 1
        }
    })
    return data
}

// get depended packages on a given package
async function getDependedPackages(packageName: string, page?: number): Promise<NpmUserPageData> {

    const { data } = await axios.get(`https://www.npmjs.com/browse/depended/${packageName}`, {
        params: {
            offset: (36 * page) || 0
        },
        // this header define JSON response and not HTML page
        headers: {
            'x-spiferack': 1
        }
    })
    return data
}

// create a purl to npm package
function constructPurl(packageName: string, packageVersion?: string, scope?: string) {
    const pkg = new PackageURL(
        'npm',
        scope,
        packageName,
        packageVersion,
        undefined,
        undefined,
    );
    return pkg.toString();
}

async function getAllPackages(): Promise<Omit<AllPackagesModel, 'doc'>> {
    try {
        const { data } = await axios.get<Omit<AllPackagesModel, 'doc'>>(
            `https://replicate.npmjs.com/_all_docs`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getAllPackagesInfo(): Promise<AllPackagesModel> {
    try {
        const { data } = await axios.get<AllPackagesModel>(
            `https://replicate.npmjs.com/_all_docs?include_docs=true`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageInfo(
    packageName: string,
    abbr: boolean = true,
): Promise<PackageInfoModel> {
    try {
        const reqConfig = {
            headers: {
                Accept: 'application/vnd.npm.install-v1+json',
            },
        };
        const { data } = await axios.get<PackageInfoModel>(
            `https://registry.npmjs.org/${packageName}`,
            abbr ? reqConfig : null,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getVersionInfo(packageName: string, packageVersion: string): Promise<NpmFullVersionModel> {
    try {
        const { data } = await axios.get<NpmFullVersionModel>(
            `https://registry.npmjs.org/${packageName}/${packageVersion}`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageVersions(
    packageInfo: PackageInfoModel | string,
): Promise<string[]> {
    try {
        if (typeof packageInfo === 'string') {
            packageInfo = await getPackageInfo(packageInfo);
        }
        const versions = Object.keys(packageInfo.versions);
        return versions;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageLatestVersionInfo(
    packageName: string,
): Promise<LatestVersionModel> {
    try {
        const { data } = await axios.get<LatestVersionModel>(
            `https://registry.npmjs.org/${packageName}/latest`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageLatestVersion(packageName: string): Promise<string> {
    try {
        const { data } = await axios.get<LatestVersionModel>(
            `https://registry.npmjs.org/${packageName}/latest`,
        );
        const latest = data.version;
        return latest;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageDownloadLink(
    versionInfo: NpmFullVersionModel | PackageName,
): Promise<string> {
    try {
        if (!(versionInfo instanceof NpmFullVersionModel)) {
            versionInfo = await getVersionInfo(versionInfo.name, versionInfo.version);
        }
        const link = (versionInfo as NpmFullVersionModel)?.dist?.tarball;
        return link;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageDependencies(
    versionInfo: NpmFullVersionModel | PackageName,
): Promise<Pick<NpmFullVersionModel, 'dependencies' | 'devDependencies'>> {
    try {
        if (!(versionInfo instanceof NpmFullVersionModel)) {
            versionInfo = await getVersionInfo(versionInfo.name, versionInfo.version);
        }
        const deps = {
            dependencies: (versionInfo as NpmFullVersionModel).dependencies,
            devDependencies: (versionInfo as NpmFullVersionModel).devDependencies,
        };
        return deps;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageTimes(
    packageInfo: PackageInfoModel | string,
): Promise<FullPackageTimeModel> {
    try {
        if (typeof packageInfo === 'string') {
            packageInfo = await getPackageInfo(packageInfo, false);
        }
        const times = packageInfo.time;
        return times;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageVersionsDownloads(
    packageName: string,
): Promise<PackageVersionsDownloadsModel> {
    try {
        const { data } = await axios.get<PackageVersionsDownloadsModel>(
            `https://api.npmjs.org/versions/${packageName}/last-week`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getPackageRangeDownloads(
    packageName: string,
    timeRange: ITimeRange | 'last-day' | 'last-week' | 'last-month',
): Promise<NpmPackageRangesDownloadsModel> {
    try {
        const { data } = await axios.get<NpmPackageRangesDownloadsModel>(
            `https://api.npmjs.org/downloads/range/${timeRange}/${packageName}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            },
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getPackagePointDownloads(
    packageName: string,
    timeRange: 'last-day' | 'last-week' | 'last-month' | ITimeRange,
): Promise<NpmPackagePointDownloadsModel> {
    try {
        const { data } = await axios.get<NpmPackagePointDownloadsModel>(
            `https://api.npmjs.org/downloads/point/${timeRange}/${packageName}`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function searchPackageName(
    packageName: string,
    size: number,
): Promise<SearchPackageResultsModel[]> {
    try {
        const { data } = await axios.get<{
            objects: SearchPackageResultsModel[];
        }>(`https://registry.npmjs.org/-/v1/search`, {
            params: { text: packageName, size: size },
        });
        const packages = data.objects;
        return packages;
    } catch (err) {
        console.log(err);
    }
}

export default {
    getPackagePageData,
    getUserPageData,
    getDependedPackages,
    getAllPackages,
    getAllPackagesInfo,
    getPackageInfo,
    getVersionInfo,
    getPackageVersions,
    getPackageLatestVersionInfo,
    getPackageLatestVersion,
    getPackageDownloadLink,
    getPackageDependencies,
    getPackageTimes,
    getPackageVersionsDownloads,
    getPackageRangeDownloads,
    getPackagePointDownloads,
    searchPackageName,
    constructPurl,
};

import NpmAggregatedModel from '@/models/aggregated-data/npm-aggregated-model';
import npm from './npm';

async function init(
    packageName: string,
    packageVersion?: string,
    packageScope?: string,
): Promise<NpmAggregatedModel> {
    try {
        // fetch all data
        // if version not specify -> set as latest version;
        packageVersion = packageVersion
            ? packageVersion
            : await npm.getPackageLatestVersion(packageName);
        // fetch package page data
        const npmPackagePageData = await npm.getPackagePageData(
            packageName,
            packageVersion,
            packageScope,
        );
        // fetch npm package API info
        const npmPackageInfoRes = await npm.getPackageInfo(packageName, false);
        const npmVersionRes = await npm.getVersionInfo(
            packageName,
            packageVersion,
        );
        // fetch downloads count for the last month
        const lastMonthDownloadsRes = await npm.getPackagePointDownloads(
            packageName,
            'last-month',
        );
        // fetch downloads count for each day in the last month
        const lastMonthDownloadsPerDayRes = await npm.getPackageRangeDownloads(
            packageName,
            'last-month',
        );
        // extract author name
        const authorName =
            npmPackageInfoRes.author?.name || npmPackageInfoRes.author?.name;
        // if there is author name -> fetch it user info
        const authorRes = authorName
            ? await npm.getUserPageData(authorName.split(' ')[0].toLowerCase())
            : null;
        // fetch user info of requested version publisher
        const versionPublisherRes = await npm.getUserPageData(
            npmVersionRes._npmUser.name.split(' ')[0].toLowerCase(),
        );
        // fetch user info of last version publisher
        const lastPublisherRes = await npm.getUserPageData(
            npmPackagePageData.capsule.lastPublish.maintainer
                .split(' ')[0]
                .toLowerCase(),
        );

        // assign data
        const aggregation = new NpmAggregatedModel();
        aggregation.name = npmPackagePageData.capsule?.name || packageName;
        aggregation.purl = npm.constructPurl(
            packageName,
            packageVersion,
            packageScope,
        );
        aggregation.url =
            `https://www.npmjs.com${npmPackagePageData.packageUrl}` ||
            `https://www.npmjs.com/package/${packageName}`;
        aggregation.githubRepoApi = npmPackagePageData.ghapi || null;
        aggregation.description =
            npmPackagePageData.capsule?.description ||
            npmPackageInfoRes.description ||
            npmVersionRes.description ||
            null;
        aggregation.homePage =
            npmPackagePageData.packageVersion?.homepage ||
            npmPackageInfoRes.homepage ||
            npmVersionRes.homepage ||
            null;
        aggregation.keywords =
            npmPackagePageData.packageVersion.keywords ||
            npmPackageInfoRes.keywords ||
            npmVersionRes.keywords ||
            null;
        aggregation.license =
            npmPackagePageData.packageVersion.license ||
            npmPackageInfoRes.license ||
            npmVersionRes.license ||
            null;
        aggregation.versions = {
            versionsCount:
                npmPackagePageData.packument?.versions?.length ||
                Object.keys(npmPackageInfoRes.versions).length ||
                null,
            latestVersion:
                npmPackagePageData.packument?.distTags?.latest ||
                npmPackageInfoRes['dist-tags']?.latest ||
                null,
            nextVersion:
                npmPackagePageData.packument.distTags.next ||
                npmPackageInfoRes['dist-tags']?.next ||
                null,
            all: npmPackagePageData.packument?.versions || null,
            deprecated: npmPackagePageData.packument?.deprecations || null,
            requestedVersion: npmVersionRes || null,
            timeline: npmPackageInfoRes.time || null,
        };
        aggregation.createdAuthor = authorRes;
        authorRes
            ? (aggregation.createdAuthor.scope.resource.email =
                  npmPackageInfoRes.author?.email)
            : null;
        aggregation.requestedVersionPublisher = versionPublisherRes;
        versionPublisherRes
            ? (aggregation.requestedVersionPublisher.scope.resource.email =
                  npmVersionRes._npmUser.email)
            : null;
        // remove unnecessary keys
        aggregation.requestedVersionPublisher.pagination = undefined;
        aggregation.requestedVersionPublisher.npmExpansions = undefined;
        aggregation.requestedVersionPublisher.isAccountLinkEnabledForUser =
            undefined;
        aggregation.requestedVersionPublisher.user = undefined;
        aggregation.requestedVersionPublisher.userEmailVerified = undefined;
        aggregation.requestedVersionPublisher.csrftoken = undefined;
        aggregation.requestedVersionPublisher.notifications = undefined;
        aggregation.lastPublishAuthor = lastPublisherRes;
        aggregation.lastPublishAuthor.pagination = undefined;
        aggregation.lastPublishAuthor.npmExpansions = undefined;
        aggregation.lastPublishAuthor.isAccountLinkEnabledForUser = undefined;
        aggregation.lastPublishAuthor.user = undefined;
        aggregation.lastPublishAuthor.userEmailVerified = undefined;
        aggregation.lastPublishAuthor.csrftoken = undefined;
        aggregation.lastPublishAuthor.notifications = undefined;
        // end of remove unnecessary keys
        aggregation.maintainers =
            npmPackagePageData.packument?.maintainers ||
            npmPackageInfoRes.maintainers ||
            null;
        aggregation.createdAt =
            npmPackageInfoRes.time?.created ||
            new Date(
                npmPackagePageData.packument?.versions.pop()?.date?.ts,
            ).toISOString() ||
            null;
        aggregation.lastPublish =
            npmPackagePageData.capsule?.lastPublish || null;
        aggregation.lastModified = npmPackageInfoRes.time?.modified || null;
        aggregation.repository =
            npmPackagePageData.packageVersion?.repository ||
            npmPackageInfoRes.repository['url'] ||
            null;
        aggregation.adoption = {
            starsCount: npmPackageInfoRes.users
                ? Object.keys(npmPackageInfoRes.users).length
                : null,
            dependentsCount:
                npmPackagePageData.dependents?.dependentsCount || null,
            lastYearWeeklyDownloads: npmPackagePageData.downloads || null,
            lastMonthDownloads: lastMonthDownloadsRes || null,
            lastMonthDownloadsPerDay: lastMonthDownloadsPerDayRes || null,
            lastWeekDownloadsPerVersion:
                npmPackagePageData.versionsDownloads || null,
        };
        aggregation.typescript =
            npmPackagePageData.capsule?.types?.typescript || null;
        aggregation.dependencies =
            npmVersionRes.dependencies ||
            npmPackagePageData.packageVersion?.dependencies ||
            null;
        aggregation.devDependencies =
            npmVersionRes.devDependencies ||
            npmPackagePageData.packageVersion?.devDependencies ||
            null;
        aggregation.isPrivate = npmPackagePageData.private || null;
        aggregation.scope = npmPackagePageData.scope || packageScope || null;
        aggregation.readmeContext =
            npmPackagePageData.readme.data || npmPackageInfoRes.readme || null;
        aggregation.engine = {
            npm: npmVersionRes._npmVersion || null,
            node: npmVersionRes._nodeVersion || null,
        };
        return aggregation;
    } catch (err) {
        console.log(err);
    }
}

export default {
    init,
};

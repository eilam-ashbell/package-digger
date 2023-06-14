import PackageInfo from "@/components/PackageInfo";
import PackageFullModel from "@/models/package-full-model";
import convert from "@/utils/convert";
import depsDev from "@/utils/depsDev";
import git from "@/utils/git";
import npm from "@/utils/npm";
import osv from "@/utils/osv";
import { NextRequest, NextResponse } from "next/server";
import { format } from "util";

export async function GET(
    request: NextRequest,
    { params }: { params: { packageName: string } }
) {
    const packageName = params.packageName;
    const data = new PackageFullModel();

    // Get package info from npm
    const npmPackageInfo = await npm.getPackageInfo(packageName, false);

    // Get repo info from github
    const [owner, repo] = convert.gitUrlToRepoParams(
        npmPackageInfo.repository.url
    );
    const gitRepoInfo = await git.getRepo(owner, repo);
    const gitRepoUser = await git.getUser(gitRepoInfo.owner.login);
    const gitRepoLanguages = await git.getLanguages(gitRepoInfo.git_url);
    const gitRepoContributors = await git.getContributors(
        gitRepoInfo.contributors_url, 4
    );
    const gitRepoContributorsInfo = await git.getContributorsInfo(
        gitRepoContributors
    );
    const gitRepoContributorsInfoUnit = gitRepoContributorsInfo.map( (c, i) => ({...c, contributions: gitRepoContributors[i].contributions}))

    // Get package dependencies from DepsDev
    const depsDevPackageInfo = await depsDev.getPackage(packageName, "NPM");
    const depsDevProjectInfo = await depsDev.getProject(
        npmPackageInfo.repository.url
    );

    // Get vulnerabilities from OSV
    const vulns = await osv.getVulns(`pkg:npm/${packageName}`);

    // Get package download data from npm
    // ! todo - handle time ranges
    const lastYearTimeRange = convert.lastYearTimeRange();
    const lastYearTotal = await npm.getPackagePointDownloads(
        packageName,
        lastYearTimeRange
    );
    const lastYearRange = await npm.getPackageRangeDownloads(
        packageName,
        lastYearTimeRange
    );
    const lastYearByMonths = convert.lastYearToMonths(
        lastYearRange.downloads as { downloads: number; day: string }[]
    );
    const perVersion = await npm.getPackageVersionsDownloads(packageName);
    const tags = depsDevPackageInfo.versions.map((v) => ({
        name: v.versionKey.name,
        tag: v.versionKey.version,
        publishedAt: v.publishedAt,
        isDefault: v.isDefault,
    }));
    data.name = packageName;
    data.ecosystem = "npm";
    data.description = npmPackageInfo.description;
    data.metadata = {
        package: {
            author: npmPackageInfo.author,
            contributors: npmPackageInfo.contributors,
            created: npmPackageInfo.time.created,
            lastModified: npmPackageInfo.time.modified,
        },
        repo: {
            url:
                npmPackageInfo.repository.type === "git"
                    ? npmPackageInfo.repository.url
                    : "Not provided",
            name: repo,
            owner: owner,
            contributors: gitRepoContributorsInfoUnit,
            author: {
                username: gitRepoUser.login,
                email: gitRepoUser.email,
                pageUrl: gitRepoUser.html_url,
                avatarUrl: gitRepoUser.avatar_url,
                type: gitRepoUser.type,
                location: gitRepoUser.location,
                bio: gitRepoUser.bio,
                reposCount: gitRepoUser.public_repos,
                followersCount: gitRepoUser.followers,
                followingCount: gitRepoUser.following,
                createdAt: gitRepoUser.created_at,
            },
            createdAt: gitRepoInfo.created_at,
            lastModified: gitRepoInfo.updated_at,
        },
        license: npmPackageInfo.license,
        keywords: npmPackageInfo.keywords,
        languages: gitRepoLanguages,
    };
    data.versions = {
        current: npmPackageInfo["dist-tags"].latest,
        next: npmPackageInfo["dist-tags"].next || null,
        count: tags?.length || 0,
        tags: tags,
    };
    data.security = {
        scorecard: depsDevProjectInfo.scorecard,
        vulnerabilities: {
            count: vulns?.length || 0,
        },
    };
    data.links = {
        homepage: npmPackageInfo.homepage,
        documentation: "",
        issuesTracker: npmPackageInfo.bugs.url,
        sourceRepo: npmPackageInfo.repository.url,
        origin: "",
    };
    data.adoption = {
        starsCount: gitRepoInfo.stargazers_count,
        forksCount: gitRepoInfo.forks_count,
        openIssues: gitRepoInfo.open_issues_count,
        watchers: gitRepoInfo.watchers_count,
        downloads: {
            startDate: lastYearRange.start,
            endDate: lastYearRange.end,
            lastYearTotal: lastYearTotal.downloads as number,
            lastYearRange: lastYearByMonths as {
                downloads: number;
                month: string;
            }[],
            perVersion: perVersion.download,
        },
    };
    return NextResponse.json({ ...data });
}

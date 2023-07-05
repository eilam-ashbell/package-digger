import PackageInfo from '@/components/PackageInfo';
import PackageFullModel from '@/models/package-full-model';
import convert from '@/utils/convert';
import depsDev from '@/utils/depsDev';
import git from '@/utils/git';
import npm from '@/utils/npm';
import osv from '@/utils/osv';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { format } from 'util';
import fs from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: { packageName: string } },
) {
    const packageName = convert.url(params.packageName);
    const data = new PackageFullModel();

    // Get package info from npm
    const npmPackageInfo = await npm.getPackageInfo(packageName, false);

    // Get repo info from github
    const [owner, repo] = convert.gitUrlToRepoParams(
        npmPackageInfo.repository.url,
    );
    const gitRepoInfo = await git.getRepo(owner, repo);
    const gitRepoUser = await git.getUser(gitRepoInfo.owner.login);
    const gitRepoLanguages = await git.getLanguages(gitRepoInfo.git_url);
    // ! todo -> add contributors count to data
    const gitRepoContributors = await git.getContributors(
        gitRepoInfo.contributors_url,
        4,
    );
    const gitRepoContributorsInfo = await git.getContributorsInfo(
        gitRepoContributors.fetchedContributors,
    );
    const gitRepoContributorsInfoUnit = gitRepoContributorsInfo.map((c, i) => ({
        ...c,
        contributions: gitRepoContributors.fetchedContributors[i].contributions,
    }));

    // Get package dependencies from DepsDev
    const depsDevPackageInfo = await depsDev.getPackage(packageName, 'NPM');
    const depsDevProjectInfo = await depsDev.getProject(
        npmPackageInfo.repository.url,
    );

    // Get vulnerabilities from OSV
    const vulns = await osv.getVulns(`pkg:npm/${packageName}`);

    // Get package download data from npm
    // ! todo - handle time ranges
    const timeRange = convert.parseDatesToQuery([
        dayjs().subtract(7, 'd').toDate(),
        new Date(),
        null,
    ]);
    const total = await npm.getPackagePointDownloads(packageName, timeRange);
    const range = await npm.getPackageRangeDownloads(packageName, timeRange);
    const perVersion = await npm.getPackageVersionsDownloads(packageName);
    const perVersionParsed = Object.entries(perVersion.downloads)
        .map((v) => ({ name: v[0], downloads: v[1] }))
        .sort((a, b) => b.downloads - a.downloads);

    const tags = depsDevPackageInfo.versions.map((v) => ({
        name: v.versionKey.name,
        tag: v.versionKey.version,
        publishedAt: v.publishedAt,
        isDefault: v.isDefault,
    }));
    data.name = packageName || null;
    data.ecosystem = 'npm';
    data.description = npmPackageInfo.description || null;
    data.metadata = {
        package: {
            author: npmPackageInfo.author || null,
            contributors: npmPackageInfo.contributors || null,
            created: npmPackageInfo.time.created || null,
            lastModified: npmPackageInfo.time.modified || null,
        },
        repo: {
            url: gitRepoInfo.html_url || null,
            name: repo || null,
            owner: owner || null,
            contributors: gitRepoContributorsInfoUnit || null,
            author: {
                username: gitRepoUser.login || null,
                email: gitRepoUser.email || null,
                pageUrl: gitRepoUser.html_url || null,
                avatarUrl: gitRepoUser.avatar_url || null,
                type: gitRepoUser.type || null,
                location: gitRepoUser.location || null,
                bio: gitRepoUser.bio || null,
                reposCount: gitRepoUser.public_repos || null,
                followersCount: gitRepoUser.followers || null,
                followingCount: gitRepoUser.following || null,
                createdAt: gitRepoUser.created_at || null,
            },
            createdAt: gitRepoInfo.created_at || null,
            lastModified: gitRepoInfo.updated_at || null,
        },
        license: npmPackageInfo.license || null,
        keywords: npmPackageInfo.keywords || [],
        languages: gitRepoLanguages || null,
    };
    data.versions = {
        current: npmPackageInfo['dist-tags'].latest || null,
        next: npmPackageInfo['dist-tags'].next || null,
        count: tags?.length || 0,
        tags: tags || null,
    };
    data.security = {
        scorecard: depsDevProjectInfo.scorecard || null,
        // vulnerabilities: {
        //     count: vulns?.length || 0,
        // },
    };
    data.links = {
        homepage: npmPackageInfo.homepage || null,
        documentation: '' || null,
        issuesTracker: npmPackageInfo.bugs.url || null,
        sourceRepo: npmPackageInfo.repository.url.split('http://')[1] || null,
        origin: '' || null,
        npm: `https://www.npmjs.com/package/${packageName}` || null,
        git: gitRepoInfo.html_url || null,
    };
    data.adoption = {
        starsCount: gitRepoInfo.stargazers_count || null,
        forksCount: gitRepoInfo.forks_count || null,
        openIssues: gitRepoInfo.open_issues_count || null,
        watchers: gitRepoInfo.watchers_count || null,
        downloads: {
            startDate: range.start || null,
            endDate: range.end || null,
            point: total.downloads as number || null,
            // range: range.downloads as {
            //     downloads: number;
            //     day: string;
            // }[] || null,
            perVersion: perVersionParsed || null,
        },
    };
    fs.writeFile('packageInfo.json', JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
        }
    });
    return NextResponse.json({ ...data });
}

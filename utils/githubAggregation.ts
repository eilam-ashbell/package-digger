import GithubAggregatedModel from '@/models/aggregated-data/github-aggregated-model';
import githubService from './githubService';

async function init(
    owner: string,
    repo: string,
    tag?: string,
): Promise<GithubAggregatedModel> {
    try {
        // fetch all data
        const aggregation = new GithubAggregatedModel();
        const ownerRes = await githubService.getUser(owner);
        const repoRes = await githubService.getRepo(owner, repo);
        const lastReleaseRes = await githubService.getLastRelease(owner, repo);
        const requestedReleaseRes = await githubService.getRelease(owner, repo, (tag || lastReleaseRes.name));
        const releasesRes = await githubService.getReleasesCount(owner, repo);
        const languagesRes = await githubService.getLanguages(owner, repo);
        const versionsCountRes = await githubService.getVersionsCount(
            owner,
            repo,
        );
        const commitsByContributorRes =
            await githubService.getCommitsByContributor(owner, repo);
        const hourlyCommitsByDaysRes =
            await githubService.getHourlyCommitsByDays(owner, repo);
        const totalCommitsByOwnerAndAllRes =
            await githubService.getTotalCommitsByOwnerAndAll(owner, repo);
        const weeklyCodeChangesRes = await githubService.getWeeklyCodeChanges(
            owner,
            repo,
        );
        const weeklyLastYearCommitActivityRes =
            await githubService.getWeeklyLastYearCommitActivity(owner, repo);
        const communityMetricRes = await githubService.getCommunityMetric(
            owner,
            repo,
        );
        const sbomRes = await githubService.getSbom(owner, repo);
        const dependentsRes = await githubService.getDependentsReposCount(
            owner,
            repo,
        );
        const allIssuesCountRes = await githubService.getIssuesCount(
            owner,
            repo,
            { state: 'all', sort: 'created' },
        );
        const contributorsRes = await githubService.getContributors(
            owner,
            repo,
            {
                max: 5,
            },
        );
        const contributorsDetailsRes = await githubService.getContributorsInfo(
            contributorsRes.fetchedContributors,
        );

        // assign data
        aggregation.name = repoRes.name;
        aggregation.fullName = repoRes.full_name;
        aggregation.description = repoRes.description;
        aggregation.purl = githubService.constructPurl(owner, repo);
        aggregation.url = repoRes.html_url;
        aggregation.contributors = {
            count: contributorsRes.contributorsCount,
            top5: contributorsDetailsRes,
        };
        aggregation.topics = repoRes.topics;
        aggregation.owner = ownerRes;
        aggregation.isArchived = repoRes.archived;
        aggregation.isDisabled = repoRes.disabled;
        aggregation.isPrivate = repoRes.private;
        aggregation.isFork = repoRes.fork;
        aggregation.hasDiscussions = repoRes.has_discussions;
        aggregation.hasWiki = repoRes.has_wiki;
        aggregation.createdAt = repoRes.created_at;
        aggregation.lastModified = repoRes.updated_at;
        aggregation.visibility = repoRes.visibility;
        aggregation.languages = {
            primary: repoRes.language,
            all: languagesRes,
        };
        aggregation.homePage = repoRes.homepage;
        aggregation.discSize = repoRes.size;
        aggregation.adoption = {
            forksCount: repoRes.forks_count,
            openIssuesCount: repoRes.open_issues_count,
            starsCount: repoRes.stargazers_count,
            dependentsReposCount: dependentsRes,
        };
        aggregation.versions = {
            tagsCount: versionsCountRes,
            releasesCount: releasesRes,
            latestRelease: lastReleaseRes,
            requestedRelease: requestedReleaseRes
        };
        aggregation.statistics = {
            commitsByContributor: commitsByContributorRes,
            hourlyCommitCountForEachDay: hourlyCommitsByDaysRes,
            totalCommitsOfAllAndOwnerInLastYear: totalCommitsByOwnerAndAllRes,
            weeklyCodeChangesStats: weeklyCodeChangesRes,
            weeklyLastYearCommitActivity: weeklyLastYearCommitActivityRes,
        };
        aggregation.communityMetric = communityMetricRes;
        aggregation.sbom = {
            count: sbomRes.sbom.packages.length,
            list: sbomRes.sbom.packages.map((p) => ({
                name: p.name.split(':')[1],
                version: p.versionInfo,
            })),
        };
        aggregation.issues = {
            hasIssues: repoRes.has_issues,
            total: allIssuesCountRes,
            open: repoRes.open_issues_count,
            closed: allIssuesCountRes - repoRes.open_issues_count,
        };

        return aggregation;
    } catch (err) {
        console.log(err);
    }
}

export default {
    init,
};

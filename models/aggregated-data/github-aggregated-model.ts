import githubService from '@/utils/githubService';
import GitAuthorModel from '../git/git-author-model';
import GitCommunityMetricModel from '../git/git-community-metric-model';
import GitCommitsByContributorModel from '../git/stats/git-commit-by-contributor-model';
import GitTotalCommits from '../git/stats/git-total-commits-model';
import GitWeeklyCommitModel from '../git/stats/git-weekly-commits-model';
import UserModel from '../git/user-model';
import GitReleaseModel from '../git/git-release-model';
import OwnerModel from '../git/owner-model';

export default class GithubAggregatedModel {
    purl: string;
    url: string;
    name: string;
    fullName: string;
    description: string;
    contributors: {
        count: number;
        top5: UserModel[];
    };
    topics: string[];
    owner: GitAuthorModel;
    createdAt: string;
    lastModified: string;
    isArchived: boolean;
    isDisabled: boolean;
    isPrivate: boolean;
    isFork: boolean;
    hasDiscussions: boolean;
    hasWiki: boolean;
    visibility: string;
    languages: {
        primary: string;
        all: Record<string, number>;
    };
    homePage: string;
    discSize: number;
    adoption: {
        starsCount: number;
        forksCount: number;
        openIssuesCount: number;
        dependentsReposCount: number;
    };
    versions: {
        tagsCount: number;
        releasesCount: number;
        latestRelease: GitReleaseModel;
        requestedRelease: GitReleaseModel;
    };
    statistics: {
        weeklyCodeChangesStats: number[][];
        weeklyLastYearCommitActivity: GitWeeklyCommitModel[];
        commitsByContributor: GitCommitsByContributorModel[];
        totalCommitsOfAllAndOwnerInLastYear: GitTotalCommits;
        hourlyCommitCountForEachDay: number[][];
    };
    communityMetric: GitCommunityMetricModel;
    sbom: {
        count: number;
        list: { name: string; version: string }[];
    };
    issues: {
        hasIssues: boolean;
        total: number;
        open: number;
        closed: number;
    };
}

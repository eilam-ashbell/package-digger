import RepoModel from '@/models/git/repo-model';
import StargazerModel from '@/models/git/stargezer-model';
import UserModel from '@/models/git/user-model';
import axios, { AxiosResponse } from 'axios';
import { env } from 'process';
import convert from './convert';
import ContributorsModel from '@/models/git/contributors-model';
import LinkHeaderDataModel from '@/models/git/link-header-data-model';
import jsdom from 'jsdom';
import { PackageURL } from 'packageurl-js';
import GitReleaseModel from '@/models/git/git-release-model';
import GitCommitsByContributorModel from '@/models/git/stats/git-commit-by-contributor-model';
import GitWeeklyCommitModel from '@/models/git/stats/git-weekly-commits-model';
import GitTotalCommits from '@/models/git/stats/git-total-commits-model';
import GitCommunityMetricModel from '@/models/git/git-community-metric-model';
import GitSbomModel from '@/models/git/git-sbom-model';
import GitIssueModel from '@/models/git/git-issue-model';
const github = axios.create({
    baseURL: 'https://api.github.com/',
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
});

// create a purl to github repo
function constructPurl(owner: string, repo: string, version?: string) {
    const pkg = new PackageURL(
        'github',
        owner,
        repo,
        version,
        undefined,
        undefined,
    );
    return pkg.toString();
}

// API to github to fetch details about specific repo. returns <RepoModel> as response
async function getRepo(owner: string, repo: string): Promise<RepoModel> {
    try {
        const { data } = await github.get<RepoModel>(`repos/${owner}/${repo}`);
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

// API to github to fetch details about specific user. returns <UserModel> as response
async function getUser(username: string) {
    try {
        const { data } = await github.get<UserModel>(`users/${username}`);
        return data;
    } catch (err) {
        console.log(err);
    }
}

// API to github to fetch all the languages there are in a specific repo.
// returns object with entries of languageName: number of bytes.
async function getLanguages(
    owner: string,
    repo: string,
): Promise<Record<string, number>> {
    try {
        const { data } = await github.get<Record<string, number>>(
            `repos/${owner}/${repo}/languages`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

// API to github to fetch the stargazers of a specific repo.
async function getStargazers(
    owner: string,
    repo: string,
    queryParams?: {
        per_page?: number;
        page?: number;
    },
): Promise<StargazerModel[]> {
    try {
        const { data } = await github.get<StargazerModel[]>(
            `repos/${owner}/${repo}/stargazers`,
            {
                params: queryParams,
                headers: {
                    Accept: 'application/vnd.github.star+json',
                },
            },
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

// API to github to fetch the contributors of a specific repo.
async function getContributors(
    owner: string,
    repo: string,
    queryParams: {
        max?: number;
        per_page?: number;
        page?: number;
    },
): Promise<ContributorsModel> {
    try {
        // define query for first request | per_page is not over max param
        const firstQuery = {
            per_page:
                queryParams.per_page > queryParams.max
                    ? queryParams.max
                    : queryParams.per_page,
            page: queryParams.page ? queryParams.page : 1,
        };
        // Get first response
        const firsPageRes = await github.get<UserModel[]>(
            `/repos/${owner}/${repo}/contributors`,
            {
                params: firstQuery,
            },
        );
        // calculate the total number of contributors in the repo
        const contributorsCount = await countResponseTotalObjects(firsPageRes);
        const { data } = firsPageRes;
        // if the first request response less data then required - continue requesting till the max number
        let i = 1;
        while (data.length < queryParams.max) {
            const res = await github.get<UserModel[]>(
                `/repos/${owner}/${repo}/contributors`,
                {
                    params: {
                        per_page: queryParams.per_page,
                        page: i + 1,
                    },
                },
            );
            const dataLength = data.length;
            data.push(...res.data);
            if (dataLength === data.length) break;
            i++;
        }
        // return the total number of contributors and contributors details
        return {
            contributorsCount: contributorsCount,
            fetchedContributors: data.slice(0, queryParams.max),
        };
    } catch (err) {
        console.log(err);
    }
}

// API to github for fetching the full details about list of users
async function getContributorsInfo(users: UserModel[]) {
    try {
        const usersInfo: UserModel[] = [];
        // for each user in list -> get it full details
        for (let u of users) {
            const { data } = await github.get<UserModel>(u.url);
            usersInfo.push(data);
        }
        // return an array of users full data
        return usersInfo;
    } catch (err) {
        console.log(err);
    }
}

// Extract 'link' header from github response.
// if there no links header -> return null.
function extractLinksFromResponse(
    gitResponse: AxiosResponse,
): LinkHeaderDataModel {
    try {
        // search for 'link' header
        const rawLinkHeader = gitResponse.headers['link'];
        // if no link header -> return null
        if (!rawLinkHeader) {
            console.log('Link header not found in the response');
            return null;
        }
        // if there is link header, search for urls and titles
        const links: LinkHeaderDataModel = {};
        const linkRegex: RegExp = /<([^>]+)>;\s*rel="([^"]+)"/g;
        let match: RegExpExecArray | null;
        // place each title as key and every url as it's value inside links object
        while ((match = linkRegex.exec(rawLinkHeader)) !== null) {
            const [, link, rel] = match;
            links[rel] = link;
        }
        return links;
    } catch (err) {
        console.log(err);
    }
}

// Extract the page number from a github API url
function extractPageNumberFromUrl(url: string): number {
    const urlObject = new URL(url);
    // search for 'page' query in url
    const pageParam = urlObject.searchParams.get('page');
    // if there is -> return page number value as number
    if (pageParam) {
        return parseInt(pageParam, 10);
    }
    // if there isn't -> return null
    return null;
}

// Extract the per_page number from a github API url
function extractPerPageFromUrl(url: string): number {
    const urlObject = new URL(url);
    // search for 'per_page' query in url
    const pageParam = urlObject.searchParams.get('per_page');
    // if there is -> return per_page number value as number
    if (pageParam) {
        return parseInt(pageParam, 10);
    }
    // if there isn't -> return 30 (default by github)
    return 30;
}

// Util function to count the total number of objects there are in a github response with pagination.
async function countResponseTotalObjects(
    gitResponse: AxiosResponse,
): Promise<number> {
    try {
        // get the link parsed header
        const links = extractLinksFromResponse(gitResponse);
        // if no link header -> return null
        if (!links) return null;
        // get the last page number
        const lastPage = extractPageNumberFromUrl(links['last']);
        const perPage = extractPerPageFromUrl(links['last']);
        // set the query params of the request to last page wnd with same per-page value as first request
        const lastPageQuery = {
            per_page: perPage,
            page: lastPage,
        };
        // fetch last page data
        const lastPageRes = await github.get<UserModel[]>(links['last'], {
            params: lastPageQuery,
        });
        // count number of object in the last page
        const lasPageCount = lastPageRes.data.length;
        // calculate the total object according to per_page and number of pages
        const totalObjects =
            lastPageQuery.per_page * (lastPage - 1) + lasPageCount;
        return totalObjects;
    } catch (err) {
        console.log(err);
    }
}

// get the top 25 trending repos according to github
async function getTrendingGitRepos(
    languages: string[],
    since: 'daily' | 'weekly' | 'monthly' = 'monthly',
) {
    try {
        const trending = {};
        // get the top 25 for each language
        for (let lang of languages) {
            const { data } = await axios.get(
                `https://github.com/trending/${lang}?since=${since}`,
            );
            // parse the html string
            const htmlPage = new jsdom.JSDOM(data);
            // select all repos elements
            const repos =
                htmlPage.window.document.body.querySelectorAll(
                    'article > h2 > a',
                );
            // insert language as key and repo's purl url as values in trending object
            trending[lang] = [];
            repos.forEach((element) => {
                const [, owner, repo] = element.getAttribute('href').split('/');
                trending[lang].push(constructPurl(owner, repo));
            });
        }
        return trending;
    } catch (err) {
        console.log(err);
    }
}

// Get the 100 most stared repos in github for the last month according to desired language
async function getTopStaredRepositories(
    languages: string[],
): Promise<{ [key: string]: string }[]> {
    // define date range of the last month.
    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const formattedCurrentDate = currentDate.toISOString().slice(0, 10);
    const formattedLastMonthDate = lastMonthDate.toISOString().slice(0, 10);
    // define the required languages as a search query
    const languagesString =
        languages.length > 0 ? `+language:${languages.join('+language:')}` : '';
    // define the base github search url
    const url = `/search/repositories`;
    // define all query params
    const queryParams = {
        q: `stars:>1${languagesString}`,
        sort: 'stars',
        order: 'desc',
        per_page: 100,
        page: 1,
    };
    try {
        // get search results
        const response = await github.get(url, { params: queryParams });
        // parse results
        const repositories: { [key: string]: string }[] =
            response.data.items.map((item: any) =>
                constructPurl(item['owner']['login'], item['name']),
            );
        // return an array purls
        return repositories;
    } catch (err) {
        console.log(err);
    }
}

async function getVersionsCount(owner: string, repo: string): Promise<number> {
    const tagsRes = await github.get(`/repos/${owner}/${repo}/tags`);
    const tagsCount = countResponseTotalObjects(tagsRes);
    return tagsCount;
}

async function getLastRelease(
    owner: string,
    repo: string,
): Promise<GitReleaseModel> {
    const { data } = await github.get<GitReleaseModel>(
        `/repos/${owner}/${repo}/releases/latest`,
    );
    return data;
}

async function getRelease(
    owner: string,
    repo: string,
    tag: string,
): Promise<GitReleaseModel> {
    const { data } = await github.get<GitReleaseModel>(
        `/repos/${owner}/${repo}/releases/tags/${tag}`,
    );
    return data;
}

async function getReleasesCount(
    owner: string,
    repo: string,
): Promise<number> {
    const releasesRes = await github.get<GitReleaseModel>(
        `/repos/${owner}/${repo}/releases`,
    );
    const releasesCount = countResponseTotalObjects(releasesRes);
    return releasesCount;
}

async function getCommitsByContributor(
    owner: string,
    repo: string,
): Promise<GitCommitsByContributorModel[]> {
    // get data from github API
    let { data } = await github.get(
        `/repos/${owner}/${repo}/stats/contributors`,
    );
    // if data didn't return -> try again after 2 sec
    if (!data) {
        while (!data) {
            setTimeout(async () => {
                data = (
                    await github.get(
                        `/repos/${owner}/${repo}/stats/contributors`,
                    )
                ).data;
            }, 2000);
        }
        return data;
    }
}

async function getHourlyCommitsByDays(
    owner: string,
    repo: string,
): Promise<number[][]> {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/stats/punch_card`,
    );
    return data;
}

async function getTotalCommitsByOwnerAndAll(
    owner: string,
    repo: string,
): Promise<GitTotalCommits> {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/stats/participation`,
    );
    return data;
}

async function getWeeklyCodeChanges(
    owner: string,
    repo: string,
): Promise<number[][]> {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/stats/code_frequency`,
    );
    return data;
}

async function getWeeklyLastYearCommitActivity(
    owner: string,
    repo: string,
): Promise<GitWeeklyCommitModel[]> {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/stats/commit_activity`,
    );
    return data;
}

async function getCommunityMetric(
    owner: string,
    repo: string,
): Promise<GitCommunityMetricModel> {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/community/profile`,
    );
    return data;
}

async function getSbom(owner: string, repo: string): Promise<GitSbomModel> {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/dependency-graph/sbom`,
    );
    return data;
}

async function getIssues(
    owner: string,
    repo: string,
    params: {
        state: 'open' | 'closed' | 'all';
        sort: 'created' | 'updated' | 'comments';
    },
): Promise<GitIssueModel[]> {
    const { data } = await github.get(`/repos/${owner}/${repo}/issues`, {
        params: params,
    });
    return data;
}

async function getIssuesCount(
    owner: string,
    repo: string,
    params: {
        state: 'open' | 'closed' | 'all';
        sort: 'created' | 'updated' | 'comments';
    },
): Promise<number> {
    const res = await github.get(`/repos/${owner}/${repo}/issues`, {
        params: params,
    });
    const count = countResponseTotalObjects(res);
    return count;
}

async function getDependentsReposCount(
    owner: string,
    repo: string,
): Promise<number> {
    try {
        const trending = {};
        const { data } = await axios.get(
            `https://github.com/${owner}/${repo}/network/dependents`,
        );
        // parse the html string
        const htmlPage = new jsdom.JSDOM(data);
        // select all repos elements
        const elements = htmlPage.window.document.body.querySelectorAll(
            '.table-list-header-toggle > a',
        );
        const elementText = elements[0].textContent;
        const regex: RegExp = /(\d+)/g;
        const matches = elementText.match(regex);
        if (matches && matches.length > 0) {
            return parseInt(matches.join(''));
        }
        return null;
    } catch (err) {
        console.log(err);
    }
}

export default {
    getRepo,
    getUser,
    getLanguages,
    getStargazers,
    getContributors,
    getContributorsInfo,
    getTrendingGitRepos,
    constructPurl,
    countResponseTotalObjects,
    getTopStaredRepositories,
    getVersionsCount,
    getLastRelease,
    getRelease,
    getReleasesCount,
    getCommitsByContributor,
    getHourlyCommitsByDays,
    getTotalCommitsByOwnerAndAll,
    getWeeklyCodeChanges,
    getWeeklyLastYearCommitActivity,
    getCommunityMetric,
    getSbom,
    getIssues,
    getIssuesCount,
    getDependentsReposCount,
};

// async function getLanguages(repoUrl: string): Promise<Record<string, number>> {
//     try {
//         const [owner, repo] = convert.gitUrlToRepoParams(repoUrl);
//         const { data } = await github.get<Record<string, number>>(
//             `repos/${owner}/${repo}/languages`,
//         );
//         return data;
//     } catch (err) {
//         console.log(err);
//     }
// }

// async function getContributors(
//     apiUrl: string,
//     max: number = 5,
//     per_page: number = 100,
//     page: number = 1,
// ): Promise<ContributorsModel> {
//     try {
//         const firstQuery = {
//             per_page: per_page > max ? max : per_page,
//             page: page,
//         };
//         const firsPageRes = await github.get<UserModel[]>(apiUrl, {
//             params: firstQuery,
//         });

//         const linkHeader = firsPageRes.headers['link'];
//         const contributorsCount = await countResponseTotalObjects(firsPageRes);
//         const { data } = firsPageRes;
//         while (data.length < max) {
//             const res = await github.get<UserModel[]>(apiUrl, {
//                 params: { per_page: per_page, page: page + 1 },
//             });
//             const dataLength = data.length;
//             data.push(...res.data);
//             if (dataLength === data.length) break;
//         }
//         return {
//             contributorsCount: contributorsCount,
//             fetchedContributors: data.slice(0, max),
//         };
//     } catch (err) {
//         console.log(err);
//     }
// }

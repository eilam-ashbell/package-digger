import RepoModel from '@/models/git/repo-model';
import StargazerModel from '@/models/git/stargezer-model';
import UserModel from '@/models/git/user-model';
import axios from 'axios';
import { env } from 'process';
import convert from './convert';
import ContributorsModel from '@/models/git/contributors-model';

const git = axios.create({
    baseURL: 'https://api.github.com/',
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
});

async function getRepo(owner: string, repo: string): Promise<RepoModel> {
    try {
        const { data } = await git.get<RepoModel>(`repos/${owner}/${repo}`);
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getUser(username: string) {
    try {
        const { data } = await git.get<UserModel>(`users/${username}`);
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getLanguages(repoUrl: string): Promise<Record<string, number>> {
    try {
        const [owner, repo] = convert.gitUrlToRepoParams(repoUrl);
        const { data } = await git.get<Record<string, number>>(
            `repos/${owner}/${repo}/languages`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getStargazers(
    owner: string,
    repo: string,
    queryParams: {
        per_page?: number;
        page?: number;
    },
): Promise<StargazerModel[]> {
    try {
        const { data } = await git.get<StargazerModel[]>(
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

async function getContributors(
    apiUrl: string,
    max: number = 5,
    per_page: number = 100,
    page: number = 1,
): Promise<ContributorsModel> {
    try {
        const firstQuery = {
            per_page: per_page > max ? max : per_page,
            page: page,
        };
        const firsPageRes = await git.get<UserModel[]>(apiUrl, {
            params: firstQuery,
        });

        const linkHeader = firsPageRes.headers['link'];
        const contributorsCount = await countContributors(linkHeader);
        const { data } = firsPageRes;
        while (data.length < max) {
            const res = await git.get<UserModel[]>(apiUrl, {
                params: { per_page: per_page, page: page + 1 },
            });
            const dataLength = data.length;
            data.push(...res.data);
            if (dataLength === data.length) break;
        }
        return {
            contributorsCount: contributorsCount,
            fetchedContributors: data.slice(0, max),
        };
    } catch (err) {
        console.log(err);
    }
}

async function getContributorsInfo(users: UserModel[]) {
    try {
        const usersInfo: UserModel[] = [];
        for (let u of users) {
            const { data } = await git.get<UserModel>(u.url);
            usersInfo.push(data);
        }
        return usersInfo;
    } catch (err) {
        console.log(err);
    }
}

interface LinkHeader {
    [key: string]: string;
}

function extractLinksFromHeader(linkHeader: string): LinkHeader {
    try {

        if (!linkHeader) {
            throw new Error('Link header not found in the response');
        }
        const links: LinkHeader = {};
        const linkRegex: RegExp = /<([^>]+)>;\s*rel="([^"]+)"/g;
        let match: RegExpExecArray | null;
        while ((match = linkRegex.exec(linkHeader)) !== null) {
            const [, link, rel] = match;
            links[rel] = link;
        }
        return links;
    } catch (err) {
        console.log(err);
        
    }
}

function extractLastPageFromUrl(url: string): number {
    const urlObject = new URL(url);
    const pageParam = urlObject.searchParams.get('page');
    if (pageParam) {
        return parseInt(pageParam, 10);
    }

    throw new Error('Page query value not found in the URL');
}

function extractPerPageFromUrl(url: string): number {
    const urlObject = new URL(url);
    const pageParam = urlObject.searchParams.get('per_page');
    if (pageParam) {
        return parseInt(pageParam, 10);
    }

    throw new Error('Page query value not found in the URL');
}

async function countContributors(linkHeader) {
    try{

        const links = linkHeader ? extractLinksFromHeader(linkHeader) : null;
        const lastPageNumber = extractLastPageFromUrl(links['last']);
        const lastPageQuery = {
            per_page: extractPerPageFromUrl(links['last']),
            page: lastPageNumber,
        };
        const lastPageRes = await git.get<UserModel[]>(links['last'], {
            params: lastPageQuery,
        });
        const lasPageCount = lastPageRes.data.length;
        const totalContributorsCount =
        lastPageQuery.per_page * (lastPageNumber - 1) + lasPageCount;
        return totalContributorsCount;
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
};

import RepoModel from '@/models/git/repo-model';
import StargazerModel from '@/models/git/stargezer-model';
import UserModel from '@/models/git/user-model';
import axios from 'axios';
import { env } from 'process';
import convert from './convert';

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
): Promise<UserModel[]> {
    try {
        const query = {
            per_page: per_page > max ? max : per_page,
            page: page,
        };
        const { data } = await git.get<UserModel[]>(apiUrl, { params: query });
        while (data.length < max) {
            const res = await git.get<UserModel[]>(apiUrl, {
                params: { per_page: per_page, page: page + 1 },
            });
            const dataLength = data.length;
            data.push(...res.data);
            console.log(`old data: ${dataLength}`);
            console.log(`data: ${data.length}`);

            if (dataLength === data.length) break;
        }
        return data.slice(0, max);
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

export default {
    getRepo,
    getUser,
    getLanguages,
    getStargazers,
    getContributors,
    getContributorsInfo,
};

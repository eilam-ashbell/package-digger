import RepoModel from "@/models/git/repo-model";
import StargazerModel from "@/models/git/stargezer-model";
import UserModel from "@/models/git/user-model";
import axios from "axios";
import { env } from "process";
import convert from "./convert";

const git = axios.create({
    baseURL: "https://api.github.com/",
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
});
async function getRepo(owner: string, repo: string): Promise<RepoModel> {
    const { data } = await git.get<RepoModel>(`repos/${owner}/${repo}`);
    return data;
}

async function getUser(username: string) {
    const { data } = await git.get<UserModel>(`users/${username}`);
    return data;
}

async function getLanguages(
    repoUrl: string
): Promise<Record<string, number>> {
    const [owner, repo ] = convert.gitUrlToRepoParams(repoUrl)
    const { data } = await git.get<Record<string, number>>(
        `repos/${owner}/${repo}/languages`
    );
    return data;
}

async function getStargazers(
    owner: string,
    repo: string,
    queryParams: {
        per_page?: number;
        page?: number;
    }
): Promise<StargazerModel[]> {
    const { data } = await git.get<StargazerModel[]>(
        `repos/${owner}/${repo}/stargazers`,
        {
            params: queryParams,
            headers: {
                Accept: "application/vnd.github.star+json",
            },
        }
    );
    return data;
}

export default {
    getRepo,
    getUser,
    getLanguages,
    getStargazers
};

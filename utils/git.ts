import RepoModel from "@/models/git/repo-model";
import UserModel from "@/models/git/user-model";
import axios from "axios";
import { env } from "process";

const git = axios.create({
    baseURL: 'https://api.github.com/',
    headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
    }
})
async function getRepo(owner: string, repo: string): Promise<RepoModel> {
    const { data } = await git.get<RepoModel>(
        `repos/${owner}/${repo}`
    );
    return data;
}

async function getUser(username: string) {
    const { data } = await git.get<UserModel>(
        `users/${username}`
    );
    return data;
}

export default {
    getRepo,
    getUser,
};

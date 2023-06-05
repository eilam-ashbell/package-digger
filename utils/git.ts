import RepoModel from "@/models/git/repo-model";
import UserModel from "@/models/git/user-model";
import axios from "axios";
import { env } from "process";

async function getRepo(owner: string, repo: string): Promise<RepoModel> {
    const { data } = await axios.get<RepoModel>(
        `https://api.github.com/repos/${owner}/${repo}`
    );
    return data;
}

async function getUser(username: string) {
    const { data } = await axios.get<UserModel>(
        `https://api.github.com/users/${username}`
    );
    return data;
}

export default {
    getRepo,
    getUser,
};

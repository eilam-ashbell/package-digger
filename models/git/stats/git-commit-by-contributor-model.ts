import GitAuthorModel from "../git-author-model";

export default class GitCommitsByContributorModel {
    author: GitAuthorModel;
    total: number;
    weeks: {
        w: number;
        a: number;
        d: number;
        c: number;
    }[];
};
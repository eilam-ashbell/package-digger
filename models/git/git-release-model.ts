import GitAuthorModel from "./git-author-model";
import GitReactionsModel from "./git-reactions-model";

export default class GitReleaseModel {
    url: string;
    assets_url: string;
    upload_url: string;
    html_url: string;
    id: number;
    author: GitAuthorModel;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    assets: [];
    tarball_url: string;
    zipball_url: string;
    body: string;
    reactions: GitReactionsModel;
}

import DepsDevScorecardCheckModel from "./deps.dev/deps-dev-scorecard-check-model";
import DepsDevScorecardModel from "./deps.dev/deps-dev-scorecard-model";
import DownloadsFullModel from "./downloads-full-model";
import UserModel from "./git/user-model";

export default class PackageFullModel {
    name: string;
    ecosystem: string;
    description: string;
    metadata: {
        package: {
            author: {
                name: string;
                email?: string;
            };
            contributors: {
                name: string;
                email?: string;
            }[];
            created: string;
            lastModified: string;
        };
        repo: {
            url: string;
            name: string;
            owner: string;
            contributors: UserModel[];
            author: {
                username: string;
                email: string;
                pageUrl: string;
                avatarUrl: string;
                type: string;
                location: string;
                bio: string;
                reposCount: number;
                followersCount: number;
                followingCount: number;
                createdAt: string;
            };
            createdAt: string;
            lastModified: string;
        };
        license: string;
        keywords: string[];
        languages: Record<string, number>;
    };
    versions: {
        current: string;
        next?: string;
        count: number;
        tags: {
            name: string;
            tag: string;
            publishedAt: string;
            isDefault: boolean;
        }[];
    };
    security: {
        scorecard: DepsDevScorecardModel;
        // vulnerabilities: {
        //     count: number;
        // };
    };
    links: {
        homepage: string;
        documentation: string;
        issuesTracker: string;
        origin: string;
        sourceRepo: string;
        npm: string;
        git: string;
    };
    adoption: {
        starsCount: number;
        forksCount: number;
        openIssues: number;
        watchers: number;
        downloads: DownloadsFullModel;
    };
}

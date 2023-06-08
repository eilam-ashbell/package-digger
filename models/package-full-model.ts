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
        // unpackedSize: number; // -> version
        // fileCount: number; // -> version
        languages: Record<string, number>;
        // engine: Record<string, string>; // -> version
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
            // isDeprecated: boolean;
        }[];
    };
    security: {
        scorecard: {
            repository: {
                name: string;
                commit: string;
            };
            scorecard: {
                version: string;
                commit: string;
            };
            checks: {
                name: string;
                documentation: {
                    shortDescription: string;
                    url: string;
                };
                score: number;
                reason: string;
                details: string[];
            }[];
            overallScore: number;
            metadata: string[];
            date: string;
        };
        vulnerabilities: {
            count: number;
        };
    };
    links: {
        homepage: string;
        documentation: string;
        issuesTracker: string;
        origin: string;
        sourceRepo: string;
    };
    adoption: {
        starsCount: number;
        forksCount: number;
        openIssues: number;
        watchers: number;
        downloads: {
            startDate: string;
            endDate: string;
            lastYearTotal: number;
            lastYearRange: {
                downloads: number;
                day: string;
            }[];
            perVersion: Record<string, number>;
        };
    };
}

export default class NpmUserPageData {
    scope: {
        type: string;
        name: string;
        parent: {
            deleted: any; //! find type
            name: string;
            description: string;
            tfa_enforced: boolean;
            avatars: Record<string, string>;
            created: string;
            updated: string;
            resource: {
                githubLegacy: boolean;
                twitterLegacy: boolean;
                github: string;
                twitter: string;
                fullname: string;
                email: string;
            };
        };
        created: string;
        updated: string;
        urls: {
            detail: string;
            refresh: string;
            teams: string;
            packages: string;
            addPackage: any; //! find type
        };
        id: number;
        account: any; //! find type
        resource: {
            githubLegacy: boolean;
            twitterLegacy: boolean;
            github: string;
            twitter: string;
            fullname: string;
            email: string;
        };
    };
    orgs: {
        total: number;
        objects: any[];
    };
    packages: {
        total: number;
        objects: {
            id: number;
            name: string;
            private: boolean;
            publish_requires_tfa: boolean;
            settings: any; //! find type
            created: {
                ts: number;
                rel: string;
            };
            updated: {
                ts: number;
                rel: string;
            };
            is_high_impact: boolean;
            description: string;
            maintainers: string[];
            'dist-tags': {
                latest: string;
            };
            lastPublish: {
                maintainer: string;
                time: string;
                formattedTime: string;
            };
            types: { typescript: Record<string, string> };
            publisher: {
                name: string;
                avatars: {
                    small: string;
                    medium: string;
                    large: string;
                };
            };
            date: {
                ts: number;
                rel: string;
            };
            version: string;
        }[];
        urls: {
            next: string;
            prev: string;
        };
    };
    pagination: {
        perPage: number;
        page: number;
    };
    isAccountLinkEnabledForUser: boolean;
    user: any; //! find type
    auditLogEnabled: boolean;
    userEmailVerified: boolean;
    csrftoken: string;
    notifications: string[];
    npmExpansions: string[];
}

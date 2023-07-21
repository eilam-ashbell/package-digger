export default class GitCommunityMetricModel {
    health_percentage: number;
    description: string;
    documentation: string;
    files: {
        code_of_conduct: {
            key: string;
            name: string;
            html_url: string;
            url: string;
        };
        code_of_conduct_file: {
            url: string;
            html_url: string;
        };
        contributing: {
            url: string;
            html_url: string;
        };
        issue_template: {
            url: string;
            html_url: string;
        };
        pull_request_template: {
            url: string;
            html_url: string;
        };
        license: {
            key: string;
            name: string;
            spdx_id: string;
            url: string;
            node_id: string;
            html_url: string;
        };
        readme: {
            url: string;
            html_url: string;
        };
    };
    updated_at: string;
    content_reports_enabled: boolean;
}

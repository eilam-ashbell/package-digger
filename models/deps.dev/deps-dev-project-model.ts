import DepsDevScorecardCheckModel from "./deps-dev-scorecard-check-model";

export default class DepsDevProjectModel {
    "projectKey": {
        id: string;
    };
    "openIssuesCount": string;
    "starsCount": string;
    "forksCount": string;
    "license": string;
    "description": string;
    "homepage": string;
    "scorecard": {
        repository: {
            name: string;
            commit: string;
        };
        scorecard: {
            version: string;
            commit: string;
        };
        checks: DepsDevScorecardCheckModel[];
        overallScore: number;
        metadata: [];
        date: string;
    };
}

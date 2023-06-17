import DepsDevScorecardCheckModel from "./deps-dev-scorecard-check-model";

export default class DepsDevScorecardModel {
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
    metadata: string[];
    date: string;
}

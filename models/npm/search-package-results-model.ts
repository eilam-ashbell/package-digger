import PersonModel from "./npm-person-model";

export default class SearchPackageResultsModel {
    "package": {
        name: string;
        scope: string;
        version: string;
        description: string;
        keywords: string[];
        date: string;
        links: {
            npm: string;
            homepage: string;
            repository: string;
            bugs: string;
        };
        author: PersonModel;
        publisher: PersonModel;
        maintainers: PersonModel[];
    };
    "score": {
        final: number;
        detail: {
            quality: number;
            popularity: number;
            maintenance: number;
        };
    };
    "searchScore": number;
}

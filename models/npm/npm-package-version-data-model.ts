import DistModel from "./dist-model";
import DistTagsModel from "./dist-tags-model";
import NpmPersonModel from "./npm-person-model";

export default class NpmPackageVersionDataModel {
    author: NpmPersonModel;
    description: string;
    homepage: string;
    repository: string;
    distTags: DistTagsModel;
    keywords: string[];
    maintainers: NpmPersonModel[];
    name: string;
    license: string;
    version: string;
    versions: {
        version: string;
        date: {
            ts: number;
            rel: string;
        };
        dist: DistModel;
    }[];
    deprecations: string[];
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
};
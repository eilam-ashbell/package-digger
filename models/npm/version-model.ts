import DistModel from "./dist-model";
import PersonModel from "./person-model";

export default class VersionModel {
    "name": string;
    "description": string;
    "version": string;
    "author": PersonModel;
    "contributors"?: PersonModel[];
    "license": string;
    "repository"?: {
        type: string;
        url: string;
    };
    "homepage"?: string;
    "keywords"?: string[];
    "dependencies"?: Record<string, string>;
    "devDependencies"?: Record<string, string>;
    "engines"?: Record<string, string>;
    "scripts": Record<string, string>;
    "gitHead"?: string;
    "bugs"?: {
        url: string;
    };
    "_id": string;
    "_nodeVersion": string;
    "_npmVersion": string;
    "dist": DistModel;
    "_npmUser": PersonModel;
    "directories"?: {};
    "maintainers": PersonModel[];
    "_npmOperationalInternal"?: {
        host: string;
        tmp: string;
    };
    "_hasShrinkwrap"?: boolean;
    "main"?: string;
    "_shasum"?: string;
    "_from"?: string;
}

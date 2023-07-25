import DistModel from "./dist-model";
import PersonModel from "./npm-person-model";

export default class LatestVersionModel {
    "name": string;
    "version": string;
    "description": string;
    "repository": {
        type: string;
        url: string;
    };
    "author": PersonModel;
    "type": string;
    "exports": {
        "import": string;
        "types":  string;
        "default":  string;
    };
    "source": string;
    "module": string;
    "types": string;
    "sideEffects": boolean;
    "license": string;
    "engines": Record<string, string>;
    "scripts": Record<string, string>;
    "keywords": string[];
    "dependencies": Record<string, string>;
    "devDependencies": Record<string, string>;
    "ava": {
        "extensions": Record<string, string>;
        "nodeArguments": string[]
    };
    "gitHead": string;
    "bugs": {
        url: string;
    };
    "homepage": string;
    "_id": string;
    "_nodeVersion": string;
    "_npmVersion": string;
    "dist": DistModel;
    "_npmUser": PersonModel
    "directories": Record<string, string>;
    "maintainers": PersonModel[]
    "_npmOperationalInternal": {
        host: string;
        tmp: string;
    };
    "_hasShrinkwrap": boolean;
}
import DistTagsModel from "./dist-tags-model";
import PackageTimeModel, { FullPackageTimeModel } from "./package-time-model";
import PersonModel from "./npm-person-model";
import VersionModel from "./npm-overview-version-model";

export default class PackageInfoModel {
    "_id": string;
    "_rev": string;
    "name": string;
    "description": string;
    "dist-tags": DistTagsModel;
    "versions": Record<string, VersionModel>;
    "readme": string;
    "maintainers": PersonModel[];
    "time": FullPackageTimeModel;
    "author": PersonModel;
    "repository": Record<string, string>;
    "users": Record<string, boolean>;
    "readmeFilename": string;
    "homepage": string;
    "keywords": string[];
    "contributors": PersonModel[];
    "bugs": Record<string, string>;
    "license": string;
}

import DepsDevLinkModel from "./deps-dev-link-model";
import DepsDevVersionKeyModel from "./deps-dev-version-key-model";

export default class DepsDevVersionInfoModel {
    "versionKey": DepsDevVersionKeyModel;
    "isDefault": boolean;
    "licenses": string[];
    "advisoryKeys": string[];
    "links": DepsDevLinkModel[];
    "publishedAt": DateConstructor;
}

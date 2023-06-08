import DepsDevLinkModel from "./deps-dev-link-model";
import DepsDevVersionKeyModel from "./deps-dev-version-key-model";

export default class DepsDevVersionModel {
    "versionKey": DepsDevVersionKeyModel;
    "isDefault": boolean;
    "publishedAt": string;
    "licenses": string[];
    "advisoryKeys": string[];
    "links": DepsDevLinkModel[];
}

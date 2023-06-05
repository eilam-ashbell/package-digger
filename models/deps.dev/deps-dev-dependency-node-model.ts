import DepsDevVersionKeyModel from "./deps-dev-version-key-model";

export default class DepsDevDependencyNodeModel {
    "versionKey": DepsDevVersionKeyModel;
    "bundled": boolean;
    "relation": "SELF" | "DIRECT" | "INDIRECT";
    "errors": string[];
}

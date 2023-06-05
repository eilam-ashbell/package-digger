import DepsDevPackageKeyModel from "./deps-dev-package-key-model";
import DepsDevVersionKeyModel from "./deps-dev-version-key-model";
import DepsDevVersionModel from "./deps-dev-version-model";


export default class DepsDevPackageModel {
    "packageKey": DepsDevPackageKeyModel;
    "versions": DepsDevVersionModel[];
}
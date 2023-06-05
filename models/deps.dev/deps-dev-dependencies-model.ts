import DepsDevDependencyNodeModel from "./deps-dev-dependency-node-model"
import DepsDevDependencyEdgeModel from "./deps-dev-dependency-edge-model"

export default class DepsDevDependenciesModel {
    "nodes": DepsDevDependencyNodeModel[];
    "edges": DepsDevDependencyEdgeModel[];
    "error": string;
}
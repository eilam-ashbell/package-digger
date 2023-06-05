import { IDepsDevSystem } from "@/models/deps.dev/IDepsDevSystem";
import DepsDevAdvisoryModel from "@/models/deps.dev/deps-dev-advisory-model";
import DepsDevDependenciesModel from "@/models/deps.dev/deps-dev-dependencies-model";
import DepsDevPackageModel from "@/models/deps.dev/deps-dev-package-model";
import DepsDevProjectModel from "@/models/deps.dev/deps-dev-project-model";
import DepsDevVersionInfoModel from "@/models/deps.dev/deps-dev-version-info-model";
import axios from "axios";

async function getPackage(
    packageName: string,
    packageSystem: IDepsDevSystem
): Promise<DepsDevPackageModel> {
    const { data } = await axios.get<DepsDevPackageModel>(
        `https://api.deps.dev/v3alpha/systems/${packageSystem}/packages/${packageName}`
    );
    return data;
}

async function getVersion(
    packageName: string,
    packageSystem: IDepsDevSystem,
    packageVersion: string
): Promise<DepsDevVersionInfoModel> {
    const { data } = await axios.get<DepsDevVersionInfoModel>(
        `https://api.deps.dev/v3alpha/systems/${packageSystem}/packages/${packageName}/versions/${packageVersion}`
    );
    return data;
}

async function getDependencies(
    packageName: string,
    packageSystem: IDepsDevSystem,
    packageVersion: string
): Promise<DepsDevDependenciesModel> {
    const { data } = await axios.get<DepsDevDependenciesModel>(
        `https://api.deps.dev/v3alpha/systems/${packageSystem}/packages/${packageName}/versions/${packageVersion}:dependencies`
    );
    return data;
}

async function getProject(projectKeyId: string): Promise<DepsDevProjectModel> {
    const { data } = await axios.get<DepsDevProjectModel>(
        `https://api.deps.dev/v3alpha/projects/${projectKeyId}`
    );
    return data;
}

async function getAdvisory(
    advisoryKeyId: string
): Promise<DepsDevAdvisoryModel> {
    const { data } = await axios.get<DepsDevAdvisoryModel>(
        `https://api.deps.dev/v3alpha/advisories/${advisoryKeyId}`
    );
    return data;
}

export default {
    getAdvisory,
    getDependencies,
    getPackage,
    getProject,
    getVersion,
};

import { IDepsDevSystem } from '@/models/deps.dev/IDepsDevSystem';
import DepsDevAdvisoryModel from '@/models/deps.dev/deps-dev-advisory-model';
import DepsDevDependenciesModel from '@/models/deps.dev/deps-dev-dependencies-model';
import DepsDevPackageModel from '@/models/deps.dev/deps-dev-package-model';
import DepsDevProjectModel from '@/models/deps.dev/deps-dev-project-model';
import DepsDevQueryModel from '@/models/deps.dev/deps-dev-query-model';
import DepsDevVersionInfoModel from '@/models/deps.dev/deps-dev-version-info-model';
import axios from 'axios';
import convert from './convert';

const depsDev = axios.create({
    baseURL: 'https://api.deps.dev/v3alpha/',
});

async function getPackage(
    packageName: string,
    packageSystem: IDepsDevSystem,
): Promise<DepsDevPackageModel> {
    const { data } = await depsDev.get<DepsDevPackageModel>(
        `systems/${packageSystem}/packages/${packageName}`,
    );
    return data;
}

async function getVersion(
    packageName: string,
    packageSystem: IDepsDevSystem,
    packageVersion: string,
): Promise<DepsDevVersionInfoModel> {
    const { data } = await depsDev.get<DepsDevVersionInfoModel>(
        `systems/${packageSystem}/packages/${packageName}/versions/${packageVersion}`,
    );
    return data;
}

async function getDependencies(
    packageName: string,
    packageSystem: IDepsDevSystem,
    packageVersion: string,
): Promise<DepsDevDependenciesModel> {
    const { data } = await depsDev.get<DepsDevDependenciesModel>(
        `systems/${packageSystem}/packages/${packageName}/versions/${packageVersion}:dependencies`,
    );
    return data;
}

async function getProject(repoUrl: string): Promise<DepsDevProjectModel> {
    const [owner, repo] = convert.gitUrlToRepoParams(repoUrl);
    const { data } = await depsDev.get<DepsDevProjectModel>(
        `projects/github.com%2F${owner}%2F${repo}`,
    );
    return data;
}

async function getAdvisory(
    advisoryKeyId: string,
): Promise<DepsDevAdvisoryModel> {
    const { data } = await depsDev.get<DepsDevAdvisoryModel>(
        `advisories/${advisoryKeyId}`,
    );
    return data;
}

async function getQuery(queryParams: {
    'hash.type'?: string;
    'hash.value'?: string;
    'versionKey.system'?: IDepsDevSystem;
    'versionKey.name'?: string;
    'versionKey.version'?: string;
}): Promise<DepsDevQueryModel> {
    const { data } = await depsDev.get<DepsDevQueryModel>(`query`, {
        params: queryParams,
    });
    return data;
}

export default {
    getAdvisory,
    getDependencies,
    getPackage,
    getProject,
    getVersion,
    getQuery,
};

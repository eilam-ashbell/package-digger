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
    try {
        const { data } = await depsDev.get<DepsDevPackageModel>(
            `systems/${packageSystem}/packages/${packageName}`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getVersion(
    packageName: string,
    packageSystem: IDepsDevSystem,
    packageVersion: string,
): Promise<DepsDevVersionInfoModel> {
    try {
        const { data } = await depsDev.get<DepsDevVersionInfoModel>(
            `systems/${packageSystem}/packages/${packageName}/versions/${packageVersion}`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getDependencies(
    packageName: string,
    packageSystem: IDepsDevSystem,
    packageVersion: string,
): Promise<DepsDevDependenciesModel> {
    try {
        const { data } = await depsDev.get<DepsDevDependenciesModel>(
            `systems/${packageSystem}/packages/${packageName}/versions/${packageVersion}:dependencies`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getProject(repoUrl: string): Promise<DepsDevProjectModel> {
    try {
        const [owner, repo] = convert.gitUrlToRepoParams(repoUrl);
        const { data } = await depsDev.get<DepsDevProjectModel>(
            `projects/github.com%2F${owner}%2F${repo}`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getAdvisory(
    advisoryKeyId: string,
): Promise<DepsDevAdvisoryModel> {
    try {
        const { data } = await depsDev.get<DepsDevAdvisoryModel>(
            `advisories/${advisoryKeyId}`,
        );
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function getQuery(queryParams: {
    'hash.type'?: string;
    'hash.value'?: string;
    'versionKey.system'?: IDepsDevSystem;
    'versionKey.name'?: string;
    'versionKey.version'?: string;
}): Promise<DepsDevQueryModel> {
    try {
        const { data } = await depsDev.get<DepsDevQueryModel>(`query`, {
            params: queryParams,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export default {
    getAdvisory,
    getDependencies,
    getPackage,
    getProject,
    getVersion,
    getQuery,
};

// import PersonModel from "./npm/person-model";
import DependenciesFullModel from './dependencies-full-model';
import OsvVulnerabilityModel from './osv/vulnerability-model';

export default class VersionFullModel {
    name: string;
    tag: string;
    fullName: string;
    ecosystem: string;
    // description: string;
    // contributors: PersonModel[];
    dist: {
        integrity?: string;
        shasum: string;
        tarball: string;
        fileCount?: number;
        unpackedSize?: number;
        signatures: {
            keyid: string;
            sig: string;
        }[];
        engine: Record<string, string>;
        // commit: {
        //     url: string;
        // };
    };
    publishedAt: string;
    isDefault: boolean;
    advisoryKeys: string[];
    dependencies: DependenciesFullModel;
    vulnerabilities: {
        vulns: OsvVulnerabilityModel[];
    };
}

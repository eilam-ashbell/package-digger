import DistModel from './dist-model';
import PersonModel from './npm-person-model';

export default class NpmOverviewVersionModel {
    name: string;
    version: string;
    date: {
        ts: number;
        rel: string;
    }
    description: string;
    author: PersonModel;
    contributors: PersonModel[];
    keywords: string[];
    engines: Record<string, string>;
    scripts: Record<string, string>;
    _id: string;
    _nodeVersion: string;
    _npmVersion: string;
    dist: DistModel;
    directories: {};
}

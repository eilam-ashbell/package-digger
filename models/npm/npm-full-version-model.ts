import DistModel from './dist-model';
import NpmOverviewVersionModel from './npm-overview-version-model';
import NpmPersonModel from "../npm/npm-person-model";

export default class NpmFullVersionModel extends NpmOverviewVersionModel{
    main: string;
    license: string;
    repository: {
        type: string;
        url: string;
    };
    bugs: {
        url: string;
    };
    homepage: string;
    types: string;
    bin: Record<string, string>;
    dependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    optionalDependencies: Record<string, string>;
    resolutions: Record<string, string>;
    gitHead: string;
    maintainers: NpmPersonModel[]; // list of the npm usernames of the people with permission to write to that package
    _npmUser: NpmPersonModel; // the account that did the publishing for that version
    _npmOperationalInternal?: {
        host: string;
        tmp: string;
    };
    _hasShrinkwrap: boolean;
    _shasum: string;
    _from: string;
}

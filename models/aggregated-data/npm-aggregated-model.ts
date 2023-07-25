import NpmFullVersionModel from '../npm/npm-full-version-model';
import NpmOverviewVersionModel from '../npm/npm-overview-version-model';
import NpmPersonModel from '../npm/npm-person-model';
import {
    NpmPackagePointDownloadsModel,
    NpmPackageRangesDownloadsModel,
    NpmPackageVersionsDownloads,
} from '../npm/npm-package-download-model';
import DistModel from '../npm/dist-model';
import NpmUserPageData from '../npm/npm-user-page-data';
import { FullPackageTimeModel } from '../npm/package-time-model';

export default class NpmAggregatedModel {
    name: string;
    purl: string;
    url: string;
    githubRepoApi: string;
    description: string;
    homePage: string;
    keywords: string[];
    license: string;
    versions: {
        versionsCount: number;
        latestVersion: string;
        nextVersion: string;
        all: {
            version: string;
            date: {
                ts: number;
                rel: string;
            };
            dist: DistModel;
        }[];
        deprecated: string[];
        requestedVersion: NpmFullVersionModel
        timeline: FullPackageTimeModel;
    };
    createdAuthor: NpmUserPageData;
    requestedVersionPublisher: NpmUserPageData;
    lastPublishAuthor: NpmUserPageData;
    maintainers: NpmPersonModel[];
    createdAt: string;
    lastPublish: {
        maintainer: string;
        time: string;
    }
    lastModified: string;
    repository: string
    adoption: {
        starsCount: number;
        dependentsCount: number;
        lastYearWeeklyDownloads: {
            downloads: number;
            label: string;
        }[];
        lastMonthDownloads: NpmPackagePointDownloadsModel;
        lastMonthDownloadsPerDay: NpmPackageRangesDownloadsModel;
        lastWeekDownloadsPerVersion: Record<string, number>;
    };
    typescript: Record<string, string>
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    isPrivate: boolean;
    scope: string;
    readmeContext: string;
    contributors: NpmPersonModel[];
    engine: {
        npm: string;
        node: string;
    }
    
}
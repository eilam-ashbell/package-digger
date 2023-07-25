export default class NpmPackageDownloadModel {
    start: string;
    end: string;
    package: string;
}

export class NpmPackagePointDownloadsModel extends NpmPackageDownloadModel {
    downloads: number;
}

export class NpmPackageRangesDownloadsModel extends NpmPackageDownloadModel {
    downloads: { downloads: number; day: string }[];
}

export class NpmPackageVersionsDownloads {
    package: string;
    downloads: Record<string, number>;  
}
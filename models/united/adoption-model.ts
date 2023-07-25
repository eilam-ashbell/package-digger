import StargazerModel from "../git/stargezer-model";
import PackageDownloadModel from "../npm/npm-package-download-model";

export default class AdoptionModel {
    stars: number;
    forks: number;
    watchers: number;
    network: number;
    subscribers: number;
    openIssues: number;
    downloads: PackageDownloadModel;

    constructor(data: AdoptionModel) {
        this.stars = data.stars
        this.forks = data.forks
        this.watchers = data.watchers
        this.network = data.network
        this.subscribers = data.subscribers
        this.openIssues = data.openIssues
        this.downloads = data.downloads
    }
}

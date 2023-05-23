export default class PackageDownloadModel {
    "downloads": number | {downloads: number, day: string}[]
    "start": string;
    "end": string;
    "package": string;
}
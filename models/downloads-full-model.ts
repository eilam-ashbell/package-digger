export default class DownloadsFullModel {
    startDate: string;
    endDate: string;
    point: number;
    range: {
        downloads: number;
        day: string;
    }[];
    perVersion: {
        name: string;
        downloads: number;
    }[];
}

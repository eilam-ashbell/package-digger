import { ITimeRange } from "@/models/npm/ITimeRange";

function url(url: string): string {
    url = url
        .replaceAll("/", "%2F")
        .replaceAll(" ", "%20")
        .replaceAll("@", "%40");
    return url;
}

function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
}

function gitUrlToRepoParams(url: string): string[] {    
    const regex =
        /(?:https?:\/\/)?(?:git\+)?(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)\.git/;
    const match = url.match(regex);    
    const [, owner, repo] = match;
    return [owner, repo]
}

function lastYearTimeRange(): ITimeRange {
    const today = new Date()
    return (`${today.getFullYear()-1}-${today.getMonth() + 1}-${today.getDay()}:${today.getFullYear()}-${today.getMonth() + 1}-${today.getDay()}`)
}

export default {
    url,
    formatNumber,
    gitUrlToRepoParams,
    lastYearTimeRange
};

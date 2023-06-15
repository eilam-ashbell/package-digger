import { ITimeRange } from "@/models/npm/ITimeRange";
import { DateRangePickerValue } from "@tremor/react";
import dayjs from "dayjs";

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
    return [owner, repo];
}

function lastYearTimeRange(): ITimeRange {
    const today = new Date();
    return `${today.getFullYear() - 1}-${
        today.getMonth() + 1
    }-${today.getDate()}:${today.getFullYear()}-${
        today.getMonth() + 1
    }-${today.getDate()}`;
}

function parseDatesToQuery(dates: DateRangePickerValue): ITimeRange {
    const firstDate = new Date(dates[0]);
    const secondDate = new Date(dates[1]);
    const todayParsed = dayjs(new Date()).format("YYYY-MM-DD");
    const firstParsed = dayjs(firstDate).format("YYYY-MM-DD");
    const secondParsed = dayjs(secondDate).format("YYYY-MM-DD");
    const dateQuery =
        firstParsed === todayParsed && secondParsed === todayParsed
            ? "last-day"
            : `${firstParsed}:${secondParsed}`;
    return dateQuery as ITimeRange;
}

function lastYearToMonths(download: { downloads: number; day: string }[]) {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    const convertedToMonth = download.map((d) => ({
        downloads: d.downloads,
        month: `${new Date(d.day).getMonth() + 1}/${new Date(
            d.day
        ).getFullYear()}`,
    }));
    const downloadsPerMonth = [];
    for (let i = 1; i <= 12; i++) {
        for (let y = todayYear - 1; y <= todayYear; y++) {
            if (i >= todayMonth && y >= todayYear) {
                continue;
            }
            if (i < todayMonth && y < todayYear) {
                continue;
            }
            const DownloadObj = {
                downloads: convertedToMonth
                    .filter((d) => d.month === `${i}/${y}`)
                    .reduce((sum, current) => sum + current.downloads, 0),
                day: `${i}/${y}`,
            };
            downloadsPerMonth.push(DownloadObj);
        }
    }
    downloadsPerMonth.sort((a, b) => {
        const aSplit = a.day.split("/");
        const bSplit = b.day.split("/");
        if (aSplit[1] === bSplit[1]) {
            return Number(aSplit[0]) < Number(bSplit[0]) ? -1 : 1;
        } else {
            return aSplit[1] < bSplit[1] ? -1 : 1;
        }
    });
    return downloadsPerMonth;
}

export default {
    url,
    formatNumber,
    gitUrlToRepoParams,
    lastYearTimeRange,
    lastYearToMonths,
    parseDatesToQuery,
};

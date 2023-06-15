import { ITimeRange } from "@/models/npm/ITimeRange";
import npm from "@/utils/npm";
import axios from "axios";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const dateQuery = request.nextUrl.searchParams.get("dates");
    const packageName = request.nextUrl.searchParams.get("package");
    const dataPoints = 6
    const dayFormat = 'DD/MM/YY'

    const pointRes = await npm.getPackagePointDownloads(
        packageName,
        dateQuery as ITimeRange
    );
    const rangeRes = await npm.getPackageRangeDownloads(
        packageName,
        dateQuery as ITimeRange
    );
    const rangeDownload = rangeRes.downloads as {
        downloads: number;
        day: string;
    }[];
    const rangeGrouped = [];
    const chunkSize =
        rangeDownload.length > dataPoints
            ? Math.floor(rangeDownload.length / dataPoints)
            : 1;
    for (let i = 0; i < rangeDownload.length; i += chunkSize) {
        const chunk = rangeDownload.slice(i, i + chunkSize);
        rangeGrouped.push(chunk);
    }
    const rangeCalc = rangeGrouped.map((g) => ({
        downloads: g.reduce((sum, current) => (sum += current.downloads), 0) / g.length,
        day: dayjs(
            g.reduce(
                (sum, current) => sum + new Date(current.day).getTime(),
                0
            ) / g.length
        ).format(dayFormat),
    }));
    if (rangeCalc[rangeCalc.length - 1].day === dayjs(new Date()).format(dayFormat)) {
        rangeCalc.pop();
    }
    const perVersion = await npm.getPackageVersionsDownloads(packageName);

    return NextResponse.json({
        day: pointRes.downloads,
        range: rangeCalc,
        perVersion: perVersion.downloads,
    });
}

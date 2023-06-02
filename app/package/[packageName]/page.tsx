import BarChartCard from '@/components/BarChartCard';
import npm from '@/utils/npm';
import * as React from 'react';

export default async function page({ params }) {

    const current = await npm.getPackageLatestVersion(params.packageName)
    const res = await npm.getPackageRangeDownloads(params.packageName, 'last-week')
    const downloadsData = res.downloads;
    console.log(res);
    
    return (
        <div>
            {/* <BarChartCard data={downloadsData} title={params.packageName} subtitle={'test'}/> */}
        </div>
    )
}
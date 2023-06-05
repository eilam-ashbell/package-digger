import DependenciesCard from '@/components/DependenciesCard';
import npm from '@/utils/npm';
import { AreaChart, Bold, Button, Card, LineChart, Subtitle, Tab, TabList, Text, Title } from '@tremor/react';
import * as React from 'react';
import PackageInfo from '@/components/PackageInfo';
import VersionsInfo from '@/components/VersionsInfo';
import DownloadsCard from '@/components/DownloadsCard';
import DistCard from '@/components/DistCard';

export default async function page({ params }) {
    const pkgName = params.packageName;
    const latestVersionInfo = await npm.getPackageLatestVersionInfo(pkgName)
    const downloads = await npm.getPackageRangeDownloads(pkgName, "last-month")
    const packageInfo = await npm.getPackageInfo(pkgName, false)
    const versions = await npm.getPackageVersions(pkgName)
    const latestVersion = await npm.getPackageLatestVersion(pkgName)
    const lastPublish = Object.entries(packageInfo?.time).pop()
    const vInfo = {
        current: latestVersion,
        versions: versions,
        count: Object.entries(packageInfo.versions).length,
        lastPublish: new Date(lastPublish[1]).toLocaleDateString(),
        lastModified: new Date(packageInfo.time.modified).toLocaleDateString()
    }
    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex gap-x-2'>
                <Card className='bg-white px-8 py-4 rounded-md flex flex-col gap-y-4 text-slate-800 w-2/3'>
                    <PackageInfo name={latestVersionInfo.name} description={latestVersionInfo.description} keywords={latestVersionInfo.keywords} />
                </Card>
                <Card className='w-1/3 flex flex-col gap-y-2'>
                    <VersionsInfo current={vInfo.current} versions={vInfo.versions} count={vInfo.count} lastPublish={vInfo.lastPublish} lastModified={vInfo.lastModified} />
                </Card>
            </div>
            <Card className=''>
                <DependenciesCard direct={latestVersionInfo.dependencies} dev={latestVersionInfo.devDependencies} />
            </Card>
            <Card>
                <DownloadsCard downloads={downloads.downloads} />
            </Card>
            <Card className=''>
                <DistCard {...latestVersionInfo.dist} />
            </Card>
            <div>
                HomePage:<br />
                {latestVersionInfo.homepage}
            </div>
            <div>
                Author: <br />
                {latestVersionInfo.author.name} <br />
                {latestVersionInfo.author.email} <br />
                {latestVersionInfo.author.url}
            </div>
            <div>
                License: <br />
                {latestVersionInfo.license}
            </div>




            {/* <BarChartCard data={downloadsData} title={params.packageName} subtitle={'test'}/> */}
        </div>
    )
}
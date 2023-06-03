import DependenciesCard from '@/components/DependenciesCard';
import npm from '@/utils/npm';
import { AreaChart, Bold, Button, Card, LineChart, Subtitle, Tab, TabList, Text, Title } from '@tremor/react';
import * as React from 'react';
import { ArrowDownIcon } from "@heroicons/react/outline";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import VersionSelect from '@/components/VersionSelect';
import PackageInfo from '@/components/PackageInfo';
import VersionsInfo from '@/components/VersionsInfo';
import DownloadsCard from '@/components/DownloadsCard';

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
                <PackageInfo name={latestVersionInfo.name} description={latestVersionInfo.description} keywords={latestVersionInfo.keywords} />
                <VersionsInfo current={vInfo.current} versions={vInfo.versions} count={vInfo.count} lastPublish={vInfo.lastPublish} lastModified={vInfo.lastModified} />
            </div>
            <div className='flex flex-col gap-y-2'>
            <DependenciesCard direct={latestVersionInfo.dependencies} dev={latestVersionInfo.devDependencies} />

            </div>
            <DownloadsCard downloads={downloads.downloads} />
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



            <Card className='w-1/3'>
                <div>
                    <div>
                        fileCount: {latestVersionInfo.dist.fileCount}
                    </div>
                    <div>
                        unpackedSize: {latestVersionInfo.dist.unpackedSize / 1000} kb
                    </div>
                    <div>
                        SHA sum: {latestVersionInfo.dist.shasum}
                    </div>
                </div>
                <Button size='xs' className='w-full'>
                    Download
                </Button>
            </Card>
            {/* <BarChartCard data={downloadsData} title={params.packageName} subtitle={'test'}/> */}
        </div>
    )
}
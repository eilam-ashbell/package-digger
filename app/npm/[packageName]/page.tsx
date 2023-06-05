import DependenciesCard from '@/components/DependenciesCard';
import npm from '@/utils/npm';
import { AreaChart, Badge, Bold, Button, Card, LineChart, Subtitle, Tab, TabList, Text, Title } from '@tremor/react';
import * as React from 'react';
import PackageInfo from '@/components/PackageInfo';
import VersionsInfo from '@/components/VersionsInfo';
import DownloadsCard from '@/components/DownloadsCard';
import DistCard from '@/components/DistCard';
import depsDev from '@/utils/depsDev';
import git from '@/utils/git';

export default async function page({ params }) {
    const pkgName = params.packageName;
    const latestVersion = await npm.getPackageLatestVersion(pkgName)
    const versionInfo = await npm.getVersionInfo({name: pkgName, version: latestVersion})
    const deps = await npm.getUnitedDeps({name: pkgName, version: latestVersion})
    const downloads = await npm.getPackageRangeDownloads(pkgName, "last-month")
    let repoParams;
    if (versionInfo.repository.type === 'git') {
        repoParams = versionInfo.repository.url.replace('git+https://github.com/', '').replace('.git', '').split('/');
    }
        const  repoInfo = await git.getRepo(repoParams[0], repoParams[1])    
    const packageInfo = await npm.getPackageInfo(pkgName, false)
    const versions = await npm.getPackageVersions(pkgName)
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
                    <PackageInfo name={versionInfo.name} description={versionInfo.description} keywords={versionInfo.keywords} />
                </Card>
                <Card className='w-1/3 flex flex-col gap-y-2'>
                    <VersionsInfo current={vInfo.current} versions={vInfo.versions} count={vInfo.count} lastPublish={vInfo.lastPublish} lastModified={vInfo.lastModified} />
                </Card>
            </div>
            <Card>
                <Badge>STARS: {repoInfo?.stargazers_count}</Badge>
                <Badge>FORKS: {repoInfo?.forks_count}</Badge>
                <Badge>WATCHERS: {repoInfo?.watchers_count}</Badge>
                <Badge>OPEN ISSUES: {repoInfo?.open_issues_count}</Badge>
                <Badge>SUBSCRIBERS: {repoInfo?.subscribers_count}</Badge>
                <Badge>NETWORK: {repoInfo?.network_count}</Badge>
            </Card>
            <Card className=''>
                <DependenciesCard {...deps} />
            </Card>
            <Card>
                <DownloadsCard downloads={downloads.downloads} />
            </Card>
            <Card className=''>
                <DistCard {...versionInfo.dist} />
            </Card>
            {/* <div>
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
            </div> */}




            {/* <BarChartCard data={downloadsData} title={params.packageName} subtitle={'test'}/> */}
        </div>
    )
}
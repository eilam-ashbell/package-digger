import DependenciesCard from '@/components/DependenciesCard';
import npm from '@/utils/npm';
import { Card, Title, Text, Bold, Metric } from '@tremor/react';
import * as React from 'react';
import PackageInfo from '@/components/PackageInfo';
import VersionsInfo from '@/components/VersionsInfo';
import DownloadsCard from '@/components/DownloadsCard';
import DistCard from '@/components/DistCard';
import git from '@/utils/git';
import LanguageData from '@/components/LanguageData';
import uniteData from '@/utils/unitedData';
import depsDev from '@/utils/depsDev';
import convert from '@/utils/convert';

export default async function page({ params }) {
    const pkgName = params.packageName;
    const latestVersion = await npm.getPackageLatestVersion(pkgName)
    const versionInfo = await npm.getVersionInfo({ name: pkgName, version: latestVersion })
    const deps = await uniteData.getDeps({ name: pkgName, version: latestVersion })
    const adoption = await uniteData.getAdoption(versionInfo)
    const languages = await git.getLanguages(versionInfo.repository.url)
    const vInfo = await uniteData.getVersionInfo(pkgName)
    const test = await depsDev.getProject(versionInfo.repository.url)
    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex gap-x-2'>
                <Card className='bg-white px-8 py-4 rounded-md flex flex-col gap-y-4 text-slate-800 w-2/3'>
                    <PackageInfo name={versionInfo.name} description={versionInfo.description} keywords={versionInfo.keywords} />
                </Card>
                <Card className='w-1/3 flex flex-col gap-y-2'>
                    <VersionsInfo {...vInfo} />
                </Card>
            </div>
            <div className='flex gap-x-2'>
                <Card className="max-w-xs mx-auto">
                    <Text>Downloads last month</Text>
                    {/* <Metric>{convert.formatNumber(adoption.downloads.downloads.reduce((sum, current) =>
                        sum + current.downloads as number, 0
                    ))}</Metric> */}
                </Card>
                <Card className="max-w-xs mx-auto">
                    <Text>Vulnerabilities</Text>
                    <Metric>{test.scorecard.checks.filter( c => c.name === 'Vulnerabilities')[0].score}</Metric>
                </Card>
            </div>
            <Card>
                <DownloadsCard {...adoption} />
            </Card>
            <Card className=''>
                <DependenciesCard {...deps} />
            </Card>
            <div className='flex gap-x-2'>
                <Card>
                    <Title>Source code</Title>
                    <div className='flex gap-x-14 w-full'>
                        <div className='w-1/3'>
                            <LanguageData languages={languages} />
                        </div>
                        <div className='w-2/3'>
                            <DistCard {...versionInfo.dist} />
                        </div>
                    </div>
                </Card>
            </div>
            <Card>
                <div className='flex justify-between'>
                    <Title>Scorecard</Title>
                    <Title>{test.scorecard.overallScore}</Title>
                </div>
                {
                    test.scorecard.checks.map(c => <div className='p-6'>
                        <div className='flex justify-between'>
                            <Title>
                                {c.name}
                            </Title>
                            <Title>
                                {c.score}
                            </Title>
                        </div>
                        <Text>
                            {c.documentation.shortDescription}
                        </Text>
                        <Text className='mt-2'>
                            <Bold>
                                Reason:
                            </Bold>
                            <br />
                            {c.reason}
                        </Text>
                    </div>)
                }
            </Card>
            <ul>
                {
                    test.scorecard.checks.filter(c => c.name === 'Vulnerabilities')[0].details.map(v => <li>{v.replace('Warn: Project is vulnerable to: ', '')}</li>)
                }
            </ul>
        </div>
    )
}
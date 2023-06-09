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
import axios from 'axios';
import PackageFullModel from '@/models/package-full-model';
import VersionFullModel from '@/models/version-full-model';

export default async function page({ params }) {
    const { packageName, packageVersion } = params;
    // const latestVersion = await npm.getPackageLatestVersion(packageName)
    // const versionInfo = await npm.getVersionInfo({ name: packageName, version: packageVersion })
    // const deps = await uniteData.getDeps({ name: packageName, version: packageVersion })
    // const adoption = await uniteData.getAdoption(versionInfo)
    // const languages = await git.getLanguages(versionInfo.repository.url)
    // const vInfo = await uniteData.getVersionInfo(packageName)
    // const test = await depsDev.getProject(versionInfo.repository.url)    
    console.log(packageName, packageVersion);
    const packageInfo = await axios.get<PackageFullModel>(`http://localhost:3000/API/v1/${packageName}`)
    const versionInfo = await axios.get<VersionFullModel>(`http://localhost:3000/API/v1/${packageName}/${packageVersion}`)

    console.log(packageInfo);
    console.log(versionInfo);

    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex gap-x-2'>
                <Card className='bg-white px-8 py-4 rounded-md flex flex-col gap-y-4 text-slate-800 w-2/3'>
                    <PackageInfo name={packageInfo.data.name} description={versionInfo.data.description} keywords={packageInfo.data.metadata.keywords} />
                </Card>
                <Card className='w-1/3 flex flex-col gap-y-2'>
                    <VersionsInfo {...packageInfo.data} />
                </Card>
            </div>
            <div className='flex gap-x-2'>
                <Card className="max-w-xs mx-auto">
                    <Text>Downloads last year</Text>
                    <Metric>{convert.formatNumber(packageInfo.data.adoption.downloads.lastYearTotal)}</Metric>
                </Card>
                <Card className="max-w-xs mx-auto">
                    <Text>Vulnerabilities</Text>
                    <Metric>{versionInfo.data.vulnerabilities.vulns?.length || 0}</Metric>
                </Card>
                <Card>
                    <Text>Total deps</Text>
                    <Metric>{Object.values(versionInfo.data.dependencies.count).reduce((sum, current) => sum + current, 0)}</Metric>
                </Card>
            </div>
            <Card>
                <DownloadsCard {...packageInfo.data} />
            </Card>
            <Card className=''>
                <DependenciesCard {...versionInfo.data} />
            </Card>
            <div className='flex gap-x-2'>
                <Card>
                    <Title>Source code</Title>
                    <div className='flex gap-x-14 w-full'>
                        <div className='w-1/3'>
                            <LanguageData languages={packageInfo.data.metadata.languages} />
                        </div>
                        <div className='w-2/3'>
                            <DistCard {...versionInfo.data} />
                        </div>
                    </div>
                </Card>
            </div>
            {/* <Card>
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
            </ul> */}
        </div>
    )
}
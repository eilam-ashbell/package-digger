import DependenciesCard from '@/components/DependenciesCard';
import { Card, Title, Text, Bold, Metric } from '@tremor/react';
import * as React from 'react';
import PackageInfo from '@/components/PackageInfo';
import VersionsInfo from '@/components/VersionsInfo';
import DownloadsCard from '@/components/DownloadsCard';
import DistCard from '@/components/DistCard';
import LanguageData from '@/components/LanguageData';
import axios from 'axios';
import PackageFullModel from '@/models/package-full-model';
import VersionFullModel from '@/models/version-full-model';
import abbreviate from 'number-abbreviate'
import Image from 'next/image';

export default async function page({ params }) {
    const { packageName, packageVersion } = params;
    const packageInfo = await axios.get<PackageFullModel>(`http://localhost:3000/API/v1/${packageName}`)
    const versionInfo = await axios.get<VersionFullModel>(`http://localhost:3000/API/v1/${packageName}/${packageVersion}`)
    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex gap-x-2'>
                <Card className='bg-white px-8 py-4 rounded-md flex flex-col gap-y-4 text-slate-800 w-2/3'>
                    <PackageInfo name={packageInfo.data.name} description={versionInfo.data.description} keywords={packageInfo.data.metadata.keywords} />
                    <span>{packageInfo.data.metadata.license}</span>
                    <span>author: {packageInfo.data.metadata.package.author?.name}</span>
                    {/* <img src={packageInfo.data.metadata.repo.author.avatarUrl} alt=''></img> */}

                    {/* {packageInfo.data.metadata.repo.contributors.map(c => <><span>{c.name}|{c.contributions}</span><img src={c.avatar_url} alt=''></img></>)} */}
                </Card>
                <Card className='w-1/3 flex flex-col gap-y-2'>
                    <VersionsInfo {...packageInfo.data} />
                </Card>
            </div>
            <div className='flex gap-x-2'>
                <Card className="max-w-xs mx-auto">
                    <Text>Downloads last year</Text>
                    <Metric>{abbreviate(packageInfo.data.adoption.downloads.lastYearTotal, 1)}</Metric>
                </Card>
                <Card className="max-w-xs mx-auto">
                    <Text>Vulnerabilities</Text>
                    <Metric>{versionInfo.data.vulnerabilities.vulns?.length || 0}</Metric>
                </Card>
                <Card className="max-w-xs mx-auto">
                    <Text>Scorecard</Text>
                    <Metric>{packageInfo.data.security.scorecard.overallScore || 0}/10</Metric>
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
            <Card>
                <div className='flex justify-between'>
                    <Title>Scorecard</Title>
                    <Title>{packageInfo.data.security.scorecard.overallScore}</Title>
                </div>
                {
                    packageInfo.data.security.scorecard.checks.map(c => <div className='p-6' key={c.name}>
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
                    versionInfo.data.vulnerabilities.vulns?.map(v => <li key={v.id}>{v.summary}</li>)
                }
            </ul>
        </div>
    )
}
import DependenciesCard from '@/components/DependenciesCard';
import { Card, Badge } from '@tremor/react';
import * as React from 'react';
import LanguageData from '@/components/LanguageData';
import abbreviate from 'number-abbreviate';
import Image from 'next/image';
import Adoption from '@/components/Adoption';
import packageInfoJson from '@/packageInfo.json';
import versionInfoJson from '@/versionInfo.json';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    DocumentDuplicateIcon,
    LocationMarkerIcon,
} from '@heroicons/react/outline';
import githubIcon from '@/public/githubMark.svg';
import npmIcon from '@/public/npmMark.svg';
import Link from 'next/link';
import KeyDataBar from '@/components/KeyDataBar';
import KeyWordsList from '@/components/KeyWordsList';
import ScorecardTable from '@/components/ScorecardTable';
import TopContributors from '@/components/TopContributors';

export default async function page({ params }) {
    dayjs.extend(relativeTime);
    const { packageName, packageVersion } = params;
    // const packageInfo = (await axios.get<PackageFullModel>(
    //     `http://localhost:3000/API/v1/package/${packageName}`,
    // )).data;
    // const versionInfo = (await axios.get<VersionFullModel>(
    //     `http://localhost:3000/API/v1/package/${packageName}/${packageVersion}`,
    // )).data;
    const packageInfo = packageInfoJson.data;
    const versionInfo = versionInfoJson.data;
    const keyData = [
        {
            title: 'License',
            value: packageInfo.metadata.license,
        },
        {
            title: 'Introduced',
            value: dayjs(packageInfo.metadata.package.created).fromNow(),
        },
        {
            title: 'Modified',
            value: dayjs(packageInfo.metadata.package.lastModified).fromNow(),
        },
        {
            title: 'Last 7 days downloads',
            value: abbreviate(packageInfo.adoption.downloads.point, 1),
        },
        {
            title: 'Versions',
            value: abbreviate(packageInfo.versions.count, 1),
        },
        {
            title: 'Scorecard',
            value: abbreviate(packageInfo.security.scorecard.overallScore, 1),
        },
    ];
    return (
        <>
            <Card className='grid grid-cols-6 text-gray-700 font-light'>
                <div className='col-span-4'>
                    <div className='text-sm text-gray-400 mb-1'>
                        {`${packageInfo.versions.current} • Published 
                            ${dayjs(versionInfo.publishedAt).fromNow()}`}
                    </div>
                    <div className='flex flex-row justify-between  mb-4'>
                        <div className='flex items-baseline'>
                            <h1 className='text-4xl text-gray-900'>
                                {packageInfo.name}
                            </h1>
                            <span className='ml-4 text-sm text-gray-400 mb-1'>{`by ${packageInfo.metadata.package.author.name}`}</span>
                        </div>
                    </div>
                </div>
                <div className='col-span-2 '>
                    <div className='px-6 py-3 bg-slate-100 rounded-md text-gray-500 w-content h-fit my-auto'>
                        {/* todo: add copy functionality */}
                        <div className='flex flex-row justify-between items-center'>
                            {`npm i ${packageInfo.name}@${packageVersion}`}
                            <div className='w-6 ml-8 text-gray-400'>
                                <DocumentDuplicateIcon strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-x-2 pt-2 px-6'>
                        <Link
                            className='ml-auto'
                            href={packageInfo.links.git}
                            target='_blank'
                        >
                            <Image
                                src={githubIcon}
                                alt='github icon'
                                width={24}
                                height={24}
                            />
                        </Link>
                        <Link
                            href={packageInfo.links.npm}
                            target='_blank'
                        >
                            <Image
                                src={npmIcon}
                                alt='github icon'
                                width={24}
                                height={24}
                            />
                        </Link>
                    </div>
                </div>
                <div className='col-span-6'>
                    <KeyDataBar data={keyData} />
                </div>
                <div className='col-span-4 flex flex-col gap-y-4'>
                    <p className='my-2'>{packageInfo.description}</p>
                    <KeyWordsList keywords={packageInfo.metadata.keywords} />
                    <Adoption {...packageInfo} />
                    <DependenciesCard {...versionInfo} />
                </div>
                <div className='col-span-2'>
                    <LanguageData languages={packageInfo.metadata.languages} />
                    <TopContributors contributors={packageInfo.metadata.repo.contributors} />
                    {/* <div className='flex flex-col flex-wrap divide-y'>
                        <h2 className='text-lg text-gray-700 font-medium pb-2'>
                            Top Contributors
                        </h2>
                        {packageInfo.metadata.repo.contributors.map((c) => (
                            <div className='flex flex-row gap-x-4  py-4'>
                                <img
                                    src={c.avatar_url}
                                    className='h-12 w-12 rounded-full content-center'
                                />
                                <div>
                                    <span>{c.name}</span>
                                    <div className='flex flex-row gap-x-2 items-center'>
                                        <div className='w-4 text-gray-400'>
                                            <LocationMarkerIcon
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <span>{c.location || 'Unknown'}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y ml-auto '>
                                    <div>
                                        <span>Followers: </span>
                                        <span>
                                            {abbreviate(c.followers, 1)}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Repos: </span>
                                        <span>
                                            {abbreviate(c.public_repos, 1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> */}
                    <ScorecardTable
                        scorecard={packageInfo.security.scorecard}
                    />
                </div>
            </Card>
        </>
        // <div className='flex flex-col gap-y-2'>
        //     <div className='flex gap-x-2'>
        //         <Card className='bg-white px-8 py-4 rounded-md flex flex-col gap-y-4 text-slate-800 w-2/3'>
        //             <PackageInfo
        //                 name={packageInfo.data.name}
        //                 description={versionInfo.data.description}
        //                 keywords={packageInfo.data.metadata.keywords}
        //             />
        //             <span>{packageInfo.data.metadata.license}</span>
        //             <span>
        //                 author: {packageInfo.data.metadata.package.author?.name}
        //             </span>
        //             {/* <img src={packageInfo.data.metadata.repo.author.avatarUrl} alt=''></img> */}

        //             {/* {packageInfo.data.metadata.repo.contributors.map(c => <><span>{c.name}|{c.contributions}</span><img src={c.avatar_url} alt=''></img></>)} */}
        //         </Card>
        //         <Card className='w-1/3 flex flex-col gap-y-2'>
        //             <VersionsInfo {...packageInfo.data} />
        //         </Card>
        //     </div>
        //     <div className='flex gap-x-2'>
        //         <Card className='max-w-xs mx-auto'>
        //             <Text>Downloads last year</Text>
        //             <Metric>
        //                 {abbreviate(
        //                     packageInfo.data.adoption.downloads.point,
        //                     1,
        //                 )}
        //             </Metric>
        //         </Card>
        //         <Card className='max-w-xs mx-auto'>
        //             <Text>Vulnerabilities</Text>
        //             <Metric>
        //                 {versionInfo.data.vulnerabilities.vulns?.length || 0}
        //             </Metric>
        //         </Card>
        //         <Card className='max-w-xs mx-auto'>
        //             <Text>Scorecard</Text>
        //             <Metric>
        //                 {packageInfo.data.security.scorecard.overallScore || 0}
        //                 /10
        //             </Metric>
        //         </Card>
        //         <Card>
        //             <Text>Total deps</Text>
        //             <Metric>
        //                 {Object.values(
        //                     versionInfo.data.dependencies.count,
        //                 ).reduce((sum, current) => sum + current, 0)}
        //             </Metric>
        //         </Card>
        //     </div>
        //     <Card>
        //         <Adoption {...packageInfo.data} />
        //     </Card>
        //     <Card className=''>
        //         <DependenciesCard {...versionInfo.data} />
        //     </Card>
        //     <div className='flex gap-x-2'>
        //         <Card>
        //             <Title>Source code</Title>
        //             <div className='flex gap-x-14 w-full'>
        //                 <div className='w-1/3'>
        //                     <LanguageData
        //                         languages={packageInfo.data.metadata.languages}
        //                     />
        //                 </div>
        //                 <div className='w-2/3'>
        //                     <DistCard {...versionInfo.data} />
        //                 </div>
        //             </div>
        //         </Card>
        //     </div>
        //     <Card>
        //         <div className='flex justify-between'>
        //             <Title>Scorecard</Title>
        //             <Title>
        //                 {packageInfo.data.security.scorecard.overallScore}
        //             </Title>
        //         </div>
        //         {packageInfo.data.security.scorecard.checks.map((c) => (
        //             <div
        //                 className='p-6'
        //                 key={c.name}
        //             >
        //                 <div className='flex justify-between'>
        //                     <Title>{c.name}</Title>
        //                     <Title>{c.score}</Title>
        //                 </div>
        //                 <Text>{c.documentation.shortDescription}</Text>
        //                 <Text className='mt-2'>
        //                     <Bold>Reason:</Bold>
        //                     <br />
        //                     {c.reason}
        //                 </Text>
        //             </div>
        //         ))}
        //     </Card>
        //     <ul>
        //         {versionInfo.data.vulnerabilities.vulns?.map((v) => (
        //             <li key={v.id}>{v.summary}</li>
        //         ))}
        //     </ul>
        // </div>
    );
}

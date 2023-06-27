'use client';
import { useState } from 'react';
import { Button, Tab, TabList } from '@tremor/react';
import { DownloadIcon } from '@heroicons/react/solid';
import DependencyListItem from './DependencyListItem';
import VersionFullModel from '@/models/version-full-model';
import SectionTitle from './SectionTitle';
import axios from 'axios';
import { useParams } from 'next/navigation';
import fileDownload from 'js-file-download';
interface IDependenciesSection {
    deps: Pick<VersionFullModel, 'dependencies'>;
    packageVersion: string;
}

type ScopeType = 'all' | 'direct' | 'indirect' | 'dev';

export default function DependenciesCard({ deps, packageVersion }) {
    const [tabNumber, setTabNumber] = useState('1');
    const { direct, indirect, dev } = deps;
    const params = useParams();
    const packageName = params.packageName;
    // handle click for downloading deps
    async function handleClick(scope: ScopeType) {
        axios
            .post(
                `http://localhost:3000/API/v1/get_pkgs/?packageName=${packageName}&version=${packageVersion}&scope=${scope}`,
                deps,
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                // download the file on client side
                fileDownload(res.data, `${packageName}-${scope}.zip`);
            });
    }
    return (
        <div>
            <SectionTitle
                title='Dependencies'
                subTitle={'v' + packageVersion}
            />
            <div className='flex flex-col gap-x-4'>
                <div className='w-full'>
                    <TabList
                        value={tabNumber}
                        onValueChange={(value) => setTabNumber(value)}
                    >
                        <Tab
                            value='1'
                            text={`Direct (${
                                (direct && Object.entries(direct).length) || 0
                            })`}
                        />
                        <Tab
                            value='2'
                            text={`Dev (${
                                (dev && Object.entries(dev).length) || 0
                            })`}
                        />
                        <Tab
                            value='3'
                            text={`Indirect (${
                                (indirect && Object.entries(indirect).length) ||
                                0
                            })`}
                        />
                    </TabList>
                    {tabNumber === '1' && direct && (
                        <div className='h-60 overflow-y-scroll'>
                            {Object.entries(direct).map((d, i) => (
                                <DependencyListItem
                                    key={i}
                                    depItem={d as [string, string]}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                    {tabNumber === '2' && dev && (
                        <div className='h-60 overflow-y-scroll'>
                            {Object.entries(dev).map((d, i) => (
                                <DependencyListItem
                                    key={i}
                                    depItem={d as [string, string]}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                    {tabNumber === '3' && indirect && (
                        <div className='h-60 overflow-y-scroll'>
                            {Object.entries(indirect).map((d, i) => (
                                <DependencyListItem
                                    key={i}
                                    depItem={d as [string, string]}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className='w-full flex flex-row gap-x-1 pt-4'>
                    <Button
                        variant='primary'
                        className='w-1/4'
                        icon={DownloadIcon}
                        onClick={() => handleClick('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant='secondary'
                        className='w-1/4'
                        icon={DownloadIcon}
                        onClick={() => handleClick('direct')}
                    >
                        Direct
                    </Button>
                    <Button
                        variant='secondary'
                        className='w-1/4 border-0'
                        icon={DownloadIcon}
                        onClick={() => handleClick('indirect')}
                    >
                        Indirect
                    </Button>
                    <Button
                        variant='secondary'
                        className='w-1/4 border-0'
                        icon={DownloadIcon}
                        onClick={() => handleClick('dev')}
                    >
                        Dev
                    </Button>
                </div>
            </div>
        </div>
    );
}

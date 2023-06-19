'use client';
import { useState } from 'react';
import { Button, Tab, TabList } from '@tremor/react';
import { DownloadIcon } from '@heroicons/react/solid';
import DependencyListItem from './DependencyListItem';
import VersionFullModel from '@/models/version-full-model';
import SectionTitle from './SectionTitle';

interface IDependenciesSection {
    deps: Pick<VersionFullModel, 'dependencies'>;
    packageVersion: string;
}
export default function DependenciesCard({ deps, packageVersion }) {
    const [tabNumber, setTabNumber] = useState('1');
    const { direct, inDirect, dev } = deps;

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
                                (inDirect && Object.entries(inDirect).length) ||
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
                    {tabNumber === '3' && inDirect && (
                        <div className='h-60 overflow-y-scroll'>
                            {Object.entries(inDirect).map((d, i) => (
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
                        disabled
                    >
                        All
                    </Button>
                    <Button
                        variant='secondary'
                        className='w-1/4'
                        icon={DownloadIcon}
                        disabled
                    >
                        Direct
                    </Button>
                    <Button
                        variant='secondary'
                        className='w-1/4 border-0'
                        icon={DownloadIcon}
                        disabled
                    >
                        Indirect
                    </Button>
                    <Button
                        variant='secondary'
                        className='w-1/4 border-0'
                        icon={DownloadIcon}
                        disabled
                    >
                        Dev
                    </Button>
                </div>
            </div>
        </div>
    );
}

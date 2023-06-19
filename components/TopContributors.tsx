import UserModel from '@/models/git/user-model';
import { LocationMarkerIcon, ExternalLinkIcon } from '@heroicons/react/solid';
import * as React from 'react';
import abbreviate from 'number-abbreviate';
import Link from 'next/link';
import SectionTitle from './SectionTitle';

interface ITopContributors {
    contributors: UserModel[];
}
export default function TopContributors({ contributors }: ITopContributors) {
    return (
        <div className='flex flex-col flex-wrap divide-y divide-y-reverse'>
            <SectionTitle title='Contributors' />
            {contributors.map((c) => (
                <div className='flex flex-row gap-x-4  py-4'>
                    <img
                        src={c.avatar_url}
                        className='h-12 w-12 rounded-full content-center'
                    />
                    <div>
                        <Link
                            href={c.html_url}
                            target='_blank'
                        >
                            <span>{c.name}</span>
                            <ExternalLinkIcon
                                strokeWidth={1.5}
                                width={20}
                                color='current'
                                className='inline ml-1 mb-1 text-slate-400'
                            />
                        </Link>
                        <div className='flex flex-row gap-x-2 items-center'>
                            <div className='w-4 text-gray-400'>
                                <LocationMarkerIcon strokeWidth={1.5} />
                            </div>
                            <span>{c.location || 'Unknown'}</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y ml-auto '>
                        <Link
                            href={`${c.html_url}?tab=followers`}
                            target='_blank'
                        >
                            <span>Followers: {abbreviate(c.followers, 1)}</span>
                            <ExternalLinkIcon
                                strokeWidth={1.5}
                                width={20}
                                color='current'
                                className='inline ml-1 mb-1 text-slate-400'
                            />
                        </Link>
                        <Link
                            href={`${c.html_url}?tab=repositories`}
                            target='_blank'
                        >
                            <span>Repos: {abbreviate(c.public_repos, 1)}</span>
                            <ExternalLinkIcon
                                strokeWidth={1.5}
                                width={20}
                                color='current'
                                className='inline ml-1 mb-1 text-slate-400'
                            />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

import UserModel from '@/models/git/user-model';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import * as React from 'react';
import abbreviate from 'number-abbreviate';
import Link from 'next/link';

interface ITopContributors {
    contributors: UserModel[];
}
export default function TopContributors({ contributors }: ITopContributors) {
    return (
        <div className='flex flex-col flex-wrap divide-y'>
            <h2 className='text-lg text-gray-700 font-medium pb-2'>
                Top Contributors
            </h2>
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
                            className='underline'
                        >
                            <span>{c.name}</span>
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
                            className='underline'
                        >
                            <span>Followers: </span>
                            <span>{abbreviate(c.followers, 1)}</span>
                        </Link>
                        <Link
                            href={`${c.html_url}?tab=repositories`}
                            target='_blank'
                            className='underline'
                        >
                            <span>Repos: </span>
                            <span>{abbreviate(c.public_repos, 1)}</span>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

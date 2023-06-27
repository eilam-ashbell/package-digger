import dayjs from 'dayjs';
import Link from 'next/link';
import * as React from 'react';
import KeyWordsList from './KeyWordsList';
import Image from 'next/image';
import githubIcon from '@/public/githubMark.svg';
import npmIcon from '@/public/npmMark.svg';

interface IPackageIntro {
    currentVersion: string;
    publishedTime: string;
    packageName: string;
    authorName: string;
    gitUrl: string;
    npmUrl: string;
    description: string;
    keywords: string[];
}
export default function PackageIntro({
    currentVersion,
    publishedTime,
    packageName,
    authorName,
    gitUrl,
    npmUrl,
    description,
    keywords,
}: IPackageIntro) {
    return (
        <div>
            <div>
                <div className='text-sm text-gray-400 mb-1'>
                    <p>
                        {`current `}
                        <Link href={`/npm/${packageName}/${currentVersion}`}>
                            {currentVersion}
                        </Link>
                        {` • Published 
                            ${dayjs(publishedTime).fromNow()}`}
                    </p>
                </div>
                <div className='flex flex-row justify-between  mb-4'>
                    <div className='flex items-baseline'>
                        <h1 className='text-4xl text-gray-900'>
                            {packageName}
                        </h1>
                        {authorName && (
                            <span className='ml-4 text-sm text-gray-400 mb-1'>{`by ${authorName}`}</span>
                        )}
                    </div>
                    <div className='flex flex-row gap-x-2 pt-2 px-6'>
                        <Link
                            className='ml-auto opacity-50 hover:opacity-100'
                            href={gitUrl}
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
                            className='opacity-50 hover:opacity-100'
                            href={npmUrl}
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
                <p className='my-2'>{description}</p>
                <KeyWordsList keywords={keywords} />
            </div>
        </div>
    );
}

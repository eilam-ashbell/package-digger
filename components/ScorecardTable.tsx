'use client';
import DepsDevScorecardModel from '@/models/deps.dev/deps-dev-scorecard-model';
import Link from 'next/link';
import * as React from 'react';
import { Tooltip } from 'react-tooltip';

interface IScorecardTable {
    scorecard: DepsDevScorecardModel;
}

export default function ScorecardTable({ scorecard }: IScorecardTable) {
    return (
        <div className='flex flex-col flex-wrap divide-y'>
            <div className='flex flex-row justify-between'>
                <h2 className='text-lg text-gray-700 font-medium pb-2'>
                    Scorecard
                </h2>
                <span className='text-lg text-gray-700 font-medium pb-2'>
                    {scorecard.overallScore}
                </span>
            </div>
            {scorecard.checks.map((c) => (
                <div className='flex flex-row gap-x-4 py-2 px-3 justify-between hover:bg-gray-200'>
                    <span id={c.name}>{c.name}</span>
                    <Tooltip
                        anchorSelect={`#${c.name}`}
                        place='left'
                        events={['hover']}
                        clickable={true}
                    >
                        <p className='max-w-xs'>
                            {c.documentation.shortDescription}
                        </p>
                        <Link
                            href={c.documentation.url}
                            target='_blank'
                        >
                            <span className='italic underline'>read more</span>
                        </Link>
                    </Tooltip>
                    <span id={c.name + c.score}>{c.score}</span>
                    <Tooltip
                        anchorSelect={`#${c.name + c.score}`}
                        place='left'
                        events={['hover']}
                        clickable={true}
                    >
                        <p className='max-w-xs'>
                            {c.reason}
                        </p>
                    </Tooltip>
                </div>
            ))}
        </div>
    );
}

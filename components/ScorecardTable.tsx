'use client';
import DepsDevScorecardModel from '@/models/deps.dev/deps-dev-scorecard-model';
import Link from 'next/link';
import * as React from 'react';
import { Tooltip } from 'react-tooltip';
import SectionTitle from './SectionTitle';

interface IScorecardTable {
    scorecard: DepsDevScorecardModel;
}

export default function ScorecardTable({ scorecard }: IScorecardTable) {
    return (
        <div className='flex flex-col flex-wrap divide-y divide-y-reverse'>
            <SectionTitle
                title='Scorecard'
                subTitle={scorecard.overallScore}
            />
            {scorecard.checks.map((c, i) => (
                <div className='flex flex-row gap-x-4 py-2 px-3 justify-between hover:bg-gray-200' key={i}>
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
                        <p className='max-w-xs'>{c.reason}</p>
                    </Tooltip>
                </div>
            ))}
        </div>
    );
}

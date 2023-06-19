import * as React from 'react';

interface ISectionTitle {
    title: string;
    subTitle?: string | number;
}

export default function SectionTitle({ title, subTitle }: ISectionTitle) {
    return (
        <div className='w-full flex flex-row justify-between border-b border-slate-400 mb-4'>
            <h2 className='text-xl text-gray-700 font-medium'>{title}</h2>
            {subTitle && (
                <span className='text-lg text-gray-700 font-medium'>
                    {subTitle}
                </span>
            )}
        </div>
    );
}

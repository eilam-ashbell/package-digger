import { useRouter } from 'next/navigation';
import * as React from 'react';

interface IDependencyListItem {
    index: number;
    depItem: [string, string]
}
export default function DependencyListItem({depItem, index}: IDependencyListItem) {
    const router = useRouter()
    const handleClick = () => {
        router.push(`/npm/${depItem[0]}/${depItem[1]}`)
    }
    return (
        <div className='flex flex-row px-4 py-2 items-center hover:bg-gray-50 rounded-md cursor-pointer gap-x-4' onClick={handleClick}>
            <div className='w-8 text-gray-400'>{index + 1}.</div>
            <div className='mr-4 text-ellipsis overflow-hidden whitespace-nowrap'>{depItem[0]}</div>
            <div className='w-20 text-right ml-auto w-max'>{depItem[1]}</div>
        </div>
    )
}
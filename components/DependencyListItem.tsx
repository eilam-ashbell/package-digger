import * as React from 'react';

interface IDependencyListItem {
    depItem: [string, string]
}
export default function DependencyListItem(dep: IDependencyListItem) {
    const { depItem } = dep
    return (
        <div className='flex flex-row px-4 py-2 justify-between items-center hover:bg-gray-50 rounded-md'>
            <div className='mr-4 text-ellipsis overflow-hidden whitespace-nowrap'>{dep.depItem[0]}</div>
            <div className='w-20 text-right'>{dep.depItem[1]}</div>
        </div>
    )
}
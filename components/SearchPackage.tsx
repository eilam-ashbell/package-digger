"use client"
import * as React from 'react';
import { useRouter } from 'next/navigation';
import npm from '@/utils/npm';
import SearchPackageResultsModel from '@/models/npm/search-package-results-model';
import convert from '@/utils/convert';

export default function SearchPackage() {
    const router = useRouter();
    const [route, setRoute] = React.useState<string>()
    const [searchOptions, setSearchOptions] = React.useState<SearchPackageResultsModel[]>()

    const handleSearch = async (e) => {
        e.preventDefault()
        const packageName = convert.url(route)
        console.log(packageName);
        const res = await npm.getPackageLatestVersion(route)
        console.log(res);
        e.target.reset()
        router.push(`/package/${packageName}/${res}`)
    }

    const handleTyping = async (e) => {
        e.preventDefault()
        setRoute(e.target.value)
        const res = await npm.searchPackageName(e.target.value)
        console.log(res);
        setSearchOptions(res)
    }

    return (
        <form onSubmit={handleSearch}>
            <input type="text" name='pkgName' onChange={handleTyping} list="packages" />

            <datalist id="packages">
                {searchOptions?.map(p =>
                    <option value={p.package.name} key={`${p.package.name}@${p.package.version}`}>{`${p.package.name}@${p.package.version}`}
                    </option>
                )}
            </datalist>


            <button type="submit">Search</button>
        </form>
    )
}
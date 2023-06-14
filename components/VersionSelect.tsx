'use client'
import PackageFullModel from '@/models/package-full-model';
import { SelectBox, SelectBoxItem } from '@tremor/react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Interface } from 'readline';


export default function VersionSelect(versions: Pick<PackageFullModel, 'versions'>) {

    const router = useRouter()
    const params = useParams()
    const { packageName, packageVersion } = params
    const [value, setValue] = React.useState(packageVersion);

    const handleClick = (event) => {
        event.preventDefault()
        console.log(event.target.value);
        
    }

    React.useEffect(() => {
        router.push(`npm/${packageName}/${value}`)
    }, [value])

    return (
        <SelectBox value={value} onValueChange={setValue}>
            {
                versions.versions.tags.sort().reverse().map((v,i) =>
                    <SelectBoxItem  key={i} value={v.tag} text={v.tag} />
                )
            }
        </SelectBox>
    )
}
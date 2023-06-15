import Adoption from '@/components/Adoption';
import PackageFullModel from '@/models/package-full-model';
import { Card } from '@tremor/react';
import axios from 'axios';
import * as React from 'react';

export default async function page() {
    const packageName = 'express'
    const packageInfo = await axios.get<PackageFullModel>(`http://localhost:3000/API/v1/package/${packageName}`)

    return (
        <div>
            <Card>
                <Adoption {...packageInfo.data} />
            </Card>

        </div>
    )
}
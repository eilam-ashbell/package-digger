import npm from '@/utils/npm';
import { redirect } from 'next/navigation';
import * as React from 'react';

export default async function page({ params }) {
    // console.log(params);
    
    const current = await npm.getPackageLatestVersion(params.packageName)
    redirect(`/package/${params.packageName}/${current}`)
  return (
    <div>
      
    </div>
  )
}
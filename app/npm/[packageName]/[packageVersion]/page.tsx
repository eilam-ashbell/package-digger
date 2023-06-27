import DependenciesCard from '@/components/DependenciesCard';
import { Card } from '@tremor/react';
import LanguageData from '@/components/LanguageData';
import abbreviate from 'number-abbreviate';
import Adoption from '@/components/Adoption';
import packageInfoJson from '@/packageInfo.json';
import versionInfoJson from '@/versionInfo.json';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import KeyDataBar from '@/components/KeyDataBar';
import ScorecardTable from '@/components/ScorecardTable';
import TopContributors from '@/components/TopContributors';
import PackageIntro from '@/components/PackageIntro';
import DistCard from '@/components/DistCard';
import CopyBox from '@/components/CopyBox';
import axios from 'axios';
import PackageFullModel from '@/models/package-full-model';
import VersionFullModel from '@/models/version-full-model';
import VulnerabilitiesSection from '@/components/VulnerabilitiesSection';
import OsvVulnerabilityModel from '@/models/osv/vulnerability-model';

export default async function page({ params }) {
    dayjs.extend(relativeTime);
    const { packageName, packageVersion } = params;
    let packageInfo
    let versionInfo
    const online = 1;
    if (online) {
        packageInfo = (
            await axios.get<PackageFullModel>(
                `http://localhost:3000/API/v1/package/${packageName}`,
            )
        ).data;
        versionInfo = (
            await axios.get<VersionFullModel>(
                `http://localhost:3000/API/v1/package/${packageName}/${packageVersion}`,
            )
        ).data;
    } else {
         packageInfo = packageInfoJson;
         versionInfo = versionInfoJson;
    }

    const keyData = [
        {
            title: 'License',
            value: packageInfo.metadata.license,
        },
        {
            title: 'Introduced',
            value: dayjs(packageInfo.metadata.package.created).fromNow(),
        },
        {
            title: 'Modified',
            value: dayjs(packageInfo.metadata.package.lastModified).fromNow(),
        },
        {
            title: 'Last 7 days downloads',
            value: abbreviate(packageInfo.adoption.downloads.point, 1),
        },
        {
            title: 'Versions',
            value: abbreviate(packageInfo.versions.count, 1),
        },
        {
            title: 'Scorecard',
            value: abbreviate(packageInfo.security.scorecard.overallScore, 1),
        },
    ];
    return (
        <>
            <Card className='grid grid-cols-6 gap-x-8 gap-y-7 text-gray-700 font-light'>
                <div className='col-span-6 h-fit'>
                    <KeyDataBar data={keyData} />
                </div>
                <div className='col-span-4 h-fit flex flex-col gap-y-12'>
                    <PackageIntro
                        currentVersion={packageInfo.versions.current}
                        publishedTime={versionInfo.publishedAt}
                        packageName={packageInfo.name}
                        authorName={packageInfo.metadata.package?.author?.name}
                        gitUrl={packageInfo.links.git}
                        npmUrl={packageInfo.links.npm}
                        description={packageInfo.description}
                        keywords={packageInfo.metadata?.keywords}
                    />

                    <Adoption {...packageInfo} />
                    <DependenciesCard
                        deps={versionInfo.dependencies}
                        packageVersion={packageVersion}
                    />
                    <VulnerabilitiesSection
                        vulns={
                            versionInfo.vulnerabilities
                                ?.vulns as OsvVulnerabilityModel[]
                        }
                    />
                </div>
                <div className='col-span-2 h-fit flex flex-col gap-y-12'>
                    <CopyBox text={`npm i ${packageInfo.name}`} />
                    <DistCard
                        dist={versionInfo}
                        packageVersion={packageVersion}
                    />
                    <LanguageData languages={packageInfo.metadata.languages} />
                    <TopContributors
                        contributors={packageInfo.metadata.repo.contributors}
                    />
                    <ScorecardTable
                        scorecard={packageInfo.security.scorecard}
                    />
                </div>
            </Card>
        </>
    );
}

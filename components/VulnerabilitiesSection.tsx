import OsvVulnerabilityModel from '@/models/osv/vulnerability-model';
import SectionTitle from './SectionTitle';
import dayjs from 'dayjs';
import { parseCvssVector } from 'vuln-vects';

interface IVulnerabilitiesSection {
    vulns: OsvVulnerabilityModel[];
}

export default function VulnerabilitiesSection({
    vulns,
}: IVulnerabilitiesSection) {
    return (
        <div>
            <SectionTitle
                title='Vulnerabilities'
                subTitle={vulns?.length || '0'}
            />
            <div className='flex flex-col'>
                <div className='divide-y flex flex-col'>
                    {vulns?.map((v, i) => (
                        <div className='p-4 flex flex-col gap-y-2'>
                            <p>
                                <b>id: </b>
                                {v.id}
                            </p>
                            <p>
                                <b>summary: </b>
                                {v.summary}
                            </p>
                            <p>
                                <b>severity: </b>
                                {
                                    parseCvssVector(v.severity[0].score)
                                        .cvss3OverallSeverityText
                                }
                            </p>
                            <p>
                                <b>published: </b>
                                {dayjs(v.published).format('DD.MM.YY')}
                            </p>
                            <div className='flex flex-row gap-x-2 divide-x'>
                                {v.affected.map((a, i) => (
                                    <div
                                        key={i}
                                        className='px-4 first:pl-0'
                                    >
                                        <p>
                                            <b>introduced: </b>v
                                            {a.ranges.map((r, i) =>
                                                r.events.map((e, j) => (
                                                    <span key={j}>
                                                        {
                                                            Object.entries(
                                                                e,
                                                            ).filter(
                                                                (e) =>
                                                                    e[0] ==
                                                                    'introduced',
                                                            )[0]?.[1]
                                                        }
                                                    </span>
                                                )),
                                            )}
                                        </p>
                                        <p>
                                            <b>fixed: </b>v
                                            {a.ranges.map((r, i) =>
                                                r.events.map((e, j) => (
                                                    <span key={j}>
                                                        {
                                                            Object.entries(
                                                                e,
                                                            ).filter(
                                                                (e) =>
                                                                    e[0] ==
                                                                    'fixed',
                                                            )[0]?.[1]
                                                        }
                                                    </span>
                                                )),
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

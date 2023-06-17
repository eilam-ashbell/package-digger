import OsvVulnerabilityModel from '@/models/osv/vulnerability-model';
import axios from 'axios';

async function getVulns(purl: string): Promise<OsvVulnerabilityModel[]> {
    try {
        const payload = JSON.stringify({ package: { purl: purl } });
        const { data } = await axios.post<{ vulns: OsvVulnerabilityModel[] }>(
            'https://api.osv.dev/v1/query',
            payload,
        );
        return data.vulns;
    } catch (err) {
        console.log(err);
    }
}

export default {
    getVulns,
};

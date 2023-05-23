import SignatureModel from "./signature-model";


export default class DistModel {
    "integrity": string;
    "shasum": string;
    "tarball": string;
    "fileCount"?: number;
    "unpackedSize"?: number;
    "signatures": SignatureModel[]
    "npm-signature"?: string;
};
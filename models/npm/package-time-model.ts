
export default class PackageTimeModel {
    "modified": string;
    "created": string;
}

export type FullPackageTimeModel = PackageTimeModel & Record<string, string>
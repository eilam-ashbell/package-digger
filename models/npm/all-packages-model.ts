import PackageInfoModel from "./package-info-model";

export default class AllPackagesModel {
    "total_rows": number;
    "offset": number;
    "rows": { id: string; key: string; value: { rev: string } }[];
    "doc": PackageInfoModel
}

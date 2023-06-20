export default class DependenciesFullModel {
    direct: Record<string, string>
    indirect: Record<string, string>
    dev: Record<string, string>
    count: {
        direct: number;
        indirect: number;
        dev: number;
    };
}

export default class DepsModel {
    direct: Record<string, string>
    indirect: Record<string, string>
    dev: Record<string, string>

    constructor() {
        this.dev = {};
        this.direct = {};
        this.indirect = {};
    }
}
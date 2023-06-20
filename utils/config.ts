import path from "path";

class Config {
    // public port = 3001;
    // public apiVersion = "v1"
    public tempDir = "./temp"
    public npmTempDir = path.join(this.tempDir, 'npm')
    // public npmLogsDir = './src/7-temp/npm-logs'
}

const config = new Config();

export default config;

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
        // this will override the experiments
        config.experiments = { ...config.experiments, topLevelAwait: true }
        // this will just update topLevelAwait property of config.experiments
        // config.experiments.topLevelAwait = true
        return config
    },
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ['mongoose'],
    },
}

module.exports = nextConfig

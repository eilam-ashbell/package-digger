export const checks = {
    lastModify: '', //The last commit was made less than 3 months ago
    seniorityOfPackage: '',
    seniorityOfVersion: '',
    numberOfVersions: '',

    isThereFileCount: '',
    isTherePackageSize: '',

    isFullyOpenSource: '',
    isThereDocumentation: '',

    contributors: {
        numberOfContributors: '', //There are more than 20 contributors to the repo
        // More than 50% of contributors authored more than 1 commit
        // Less than 10 contributors constitute 50% of commits to the repo
        isContributorsLocationOnBlackList: '',
        busFactor: '', //number of contributors who authored more than 50% of all commits
        seriousRatio: '', //percentage of "serious" contributors VS one-off commiters.
    },

    Adoption: {
        downloadsPastWeek: '',
        numberOfStars: '', //More than 1000 stars
        numberOfForks: '', //More than 100 forks
        numberOpenIssues: '', //Less than 50 open issues
        numberOfDependents: '',
        numberOfPullRequests: '',
        isRepoTopStared: '', //is repo is in top 10,000 by stars //No. 104 by stars on GitHub
    },

    diversity: {
        //None of the countries have more than 50% commits to the repo
        //More than 3 countries have more than 3% of commits
        //None of the organizations have more than 50% commits to the repo
        //None of the organizations have more than 3% of commits
    },

    standards: {
        // https://github.com/expressjs/express/community
        isThereDescription: '',
        isThereReadmeFile: '',
        isThereCodeOfConduct: '',
        isContributing: '',
        isThereLicenseDefinition: '',
        isThereSecurityPolicy: '',
        isThereIssueTemplates: '',
        isTherePullRequestTemplates: '',
        isRepositoryAdminsAcceptContentReports: '',
    },

    security: {
        numberOfVulnsInVersion: '',
        scorecard: {
            finalScore: '',
            maintained: '',
            ciiBestPractices: '',
            license: '',
            branchProtection: '',
            dangerousWorkflow: '',
            packaging: '',
            tokenPermissions: '',
            securityPolicy: '',
            signedReleases: '',
            binaryArtifacts: '',
            pinnedDependencies: '',
            vulnerabilities: '',
            fuzzing: '',
            sast: '',
        },
    },
};


const checkSchema = {
    checkName: '',
    checkDescription: '',
    rawData: '',
    dataSource: '',
    checkResult: '',
    checkScore: '',
}
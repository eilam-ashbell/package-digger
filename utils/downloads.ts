import path from 'path';
import axios from 'axios';
import config from '@/utils/config';
import fs from 'fs';
import Zip from '@/node_modules/node-zip/lib/nodezip.js';
import { pipeline } from 'stream';
import DependenciesFullModel from '@/models/dependencies-full-model';

function getPkgDir(pkgName: string, pkgVersion: string): string {
    // Create a directory for the package
    const pkgTempDir = path.join(
        config.tempDir,
        'npm',
        `${pkgName}-${pkgVersion}`,
    );
    // Check if the directory already exists
    if (!fs.existsSync(pkgTempDir)) {
        // If it does, create the directory
        fs.mkdirSync(pkgTempDir, { recursive: true });
    }
    return pkgTempDir;
}

async function downloadPkgs(
    pkgName: string,
    pkgVersion: string,
    pkgDependencies: DependenciesFullModel,
    downloadScope: 'all' | 'direct' | 'indirect' | 'dev',
): Promise<string> {
    // encode package name
    pkgName = encodeURIComponent(pkgName);
    // define temp dir path
    const tempDir = getPkgDir(pkgName, pkgVersion);
    // if download scope is 'all' -> iterate every scope and download packages
    if (downloadScope === 'all') {
        delete pkgDependencies.count;
        Object.keys(pkgDependencies).map((k) => {
            const pkgsList = Object.entries(pkgDependencies[k]) as [
                string,
                string,
            ][];
            const scopeDir = path.join(tempDir, k);
            iterativeDownload(pkgsList, scopeDir).then((dir) => {
                return dir;
            });
        });
        return tempDir;
        // if scope isn't 'all' -> download scope packages
    } else {
        const pkgsList = Object.entries(pkgDependencies[downloadScope]) as [
            string,
            string,
        ][];
        const scopeDir = path.join(tempDir, downloadScope);
        const dir = await iterativeDownload(pkgsList, scopeDir);
        return dir;
    }
}

async function iterativeDownload(pkgsList: [string, string][], dir: string) {
    const promises = [];
    for (let pkg of pkgsList) {
        const scoped = pkg[0].includes('/') ? pkg[0].split('/')[1] : undefined;
        pkg[0] = encodeURIComponent(pkg[0]);
        // Check if the directory already exists
        if (!fs.existsSync(dir)) {
            // If it does, create the directory
            fs.mkdirSync(dir, { recursive: true });
        }
        const fileName = `${pkg[0]}-${pkg[1]}.tgz`;
        // Create a path to the file
        const filePath = path.join(dir, fileName);
        // Check if the file already exists
        if (fs.existsSync(filePath)) {
            // If it does, log that the file has already been downloaded
            console.log(`${fileName} already downloaded`);
        } else {
            const downloadSource = `https://registry.npmjs.org/${pkg[0]}/-/${
                scoped || pkg[0]
            }-${pkg[1]}.tgz`;
            // Make an https request to the tarball link
            const response = await axios.get(downloadSource, {
                responseType: 'stream',
            });
            const fileStream = fs.createWriteStream(filePath);
            // Stream the data from the response to the file
            promises.push(
                new Promise<void>((resolve, reject) => {
                    pipeline(response.data, fileStream, (err) => {
                        if (err) {
                            console.log(
                                `An error occurred while downloading the file: ${err.message}`,
                            );
                            reject(err);
                        } else {
                            console.log(
                                `The file has been downloaded successfully to ${filePath}`,
                            );
                            resolve();
                        }
                    });
                }),
            );
        }
    }
    await Promise.all(promises);
    return dir;
}

async function zipDir(dirPath: string): Promise<string> {
    try {
        const downloadScope = dirPath.split('/').slice(-1);
        if (downloadScope[0] == dirPath.split('/')[2]) {
            downloadScope[0] = 'all';
        }
        const zip = new Zip();
        // Call the function to add files to the zip object
        addFilesToZip(zip, dirPath, '');

        // Generate the zip file data
        const zipData = await zip.generate({ type: 'nodebuffer' });

        const zipsDir = path.join(...dirPath.split('/').slice(0, 3), 'zips');
        const zipPath = path.join(zipsDir, `${downloadScope[0]}.zip`);
        // Check if the directory already exists
        if (!fs.existsSync(zipsDir)) {
            // If it does, create the directory
            fs.mkdirSync(zipsDir, { recursive: true });
        }
        // Write the zip file data to a file
        fs.writeFileSync(zipPath, zipData);
        return zipPath;
    } catch (err) {
        console.log(err);
    }
}

// Recursively add files to the zip object
function addFilesToZip(zip, folderPath: string, relativePath: string): void {
    try {
        const files = fs.readdirSync(folderPath);
        for (let file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            const entryPath = path.join(relativePath, file);

            if (stats.isDirectory()) {
                addFilesToZip(zip, filePath, entryPath);
            } else {
                const fileData = fs.readFileSync(filePath);
                zip.file(entryPath, fileData);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

export default {
    getPkgDir,
    downloadPkgs,
    zipDir,
};

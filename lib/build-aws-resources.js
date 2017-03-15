'use strict';

const console = require('console');
const fs = require('fs');
const globby = require('globby');
const path = require('path');
const Promise = require('bluebird');
const { BUILD_AWS_RESOURCE_SCRIPT, CONCURRENCY, readPackageFile, spawn } = require('./common');

const stat = Promise.promisify(fs.stat);

function createAwsResourceFromPackage(packageFile) {
    return spawn('npm', ['run', BUILD_AWS_RESOURCE_SCRIPT], {
        cwd: path.dirname(packageFile),
        env: process.env,
        timeout: 10000
    }).catch(error => console.error(error));
}

function isAwsResourcePackage(packageFile) {
    return stat(packageFile)
        .then(x => {
            if (x.isFile) {
                return readPackageFile(packageFile)
                    .then(packageInfo => (packageInfo.scripts || {})[BUILD_AWS_RESOURCE_SCRIPT] !== undefined)
            } else {
                return Promise.resolve(false);
            }
        }).catch(error => {
            console.error(error);
            return false;
        })
}

function findLambdaPackages() {
    return globby(['node_modules/*/package.json', `lambda/*/package.json`])
        .then(files => Promise.filter(files, isAwsResourcePackage))
}

function buildAwsResources() {
    return findLambdaPackages()
        .then(files => Promise.map(files, createAwsResourceFromPackage, { concurrency: CONCURRENCY }));
}

module.exports = buildAwsResources

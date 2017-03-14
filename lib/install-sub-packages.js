'use strict';

const console = require('console');
const globby = require('globby');
const path = require('path');
const Promise = require('bluebird');
const { CONCURRENCY, spawn } = require('./common');

function install(packageFile) {
    return spawn('npm', ['install'], {
        cwd: path.dirname(packageFile),
        env: process.env,
        timeout: 30000
    }).catch(error => console.error(error));
}

function findOwnSubPackages() {
    return globby(['*/*/package.json', '!package.json', '!**/node_modules/**'])
        .then(files => files.map(file => path.resolve(file)));
}

function installSubPackages() {
    return findOwnSubPackages()
        .then(files => Promise.map(files, install, { concurrency: CONCURRENCY }));
}

module.exports = installSubPackages;

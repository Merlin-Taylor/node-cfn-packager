'use strict'

const Promise = require('bluebird');
const console = require('console');
const fs = require('fs');
const { basename, dirname, extname, resolve } = require('path');

const writeFile = Promise.promisify(fs.writeFile);

function string(obj) {
    return JSON.stringify(obj);
}

function buildCloudFormationTemplate({ template, config }) {
    return Promise.resolve()
        .then(() => {
            let outputFilename = resolve(dirname(template), `${basename(template, extname(template))}.json`);
            console.error(`Building CloudFormation template from ${template}`);
            let buildTemplate = require(resolve(template));
            return writeFile(outputFilename, string(buildTemplate(config))).then(() => {
                console.error(`Built CloudFormation template ${outputFilename}`)
                return outputFilename
            });
        })
        .catch(error => {
            console.error(`Building CloudFormation template from ${template} failed.\n${error}`);
            return Promise.reject(error);
        });
}

module.exports = buildCloudFormationTemplate;

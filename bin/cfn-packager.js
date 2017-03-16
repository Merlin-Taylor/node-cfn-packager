#!/usr/bin/env node

'use strict';

const Promise = require('bluebird');
const program = require('commander');
const fs = require('fs');
const globby = require('globby');
const yaml = require('js-yaml');
const process = require('process');
const {
    buildAwsResources,
    buildCloudFormationTemplate,
    installSubPackages
} = require('../index');

const myPackageInfo = require('../package.json');

const readFile = Promise.promisify(fs.readFile);

program
    .version(myPackageInfo.version);

program
    .command('install-subpackages')
    .description('Run `npm install` in each sub-package.')
    .action(function () {
        installSubPackages();
    });

program
    .command('build-aws-resources')
    .description('Run `npm run build-aws-resource` in each dependency and sub-package that supports it.')
    .action(function () {
        buildAwsResources();
    });

program
    .command('build-cfn-templates')
    .description('Build CloudFormation Templates')
    .option('-c, --config <file>', 'A configuration file')
    .action(function (options) {
        Promise.join(
            globby(['*.template.js']),
            readFile(options.config).then(content => yaml.safeLoad(content)),
            (templates, config) => Promise.mapSeries(templates, template => buildCloudFormationTemplate({ template, config })));
    });

program
    .command('*')
    .action(function () {
        program.help();
    })

program.parse(process.argv);

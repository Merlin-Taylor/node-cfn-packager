#!/usr/bin/env node

'use strict';

const process= require('process');
const {
    buildAwsResources,
    installSubPackages
} = require('../index');

const program = require('commander');
const myPackageInfo = require('../package.json');

program
    .version(myPackageInfo.version);

program
    .command('install-subpackages')
    .description('Run `npm install` in each sub-package.')
    .action(function() {
        installSubPackages();
    });

program
    .command('build-aws-resources')
    .description('Run `npm run build-aws-resource` in each dependency and sub-package that supports it.')
    .action(function() {
        buildAwsResources();
    });

program
    .command('*')
    .action(function() {
        program.help();
    })

program.parse(process.argv);

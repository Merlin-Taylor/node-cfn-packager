'use strict'

const buildAwsResources = require('./lib/build-aws-resources');
const buildCloudFormationTemplate = require('./lib/build-cfn-template');
const installSubPackages = require('./lib/install-sub-packages');

module.exports = {
    buildAwsResources,
    buildCloudFormationTemplate,
    installSubPackages
}
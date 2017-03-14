# cfn-packager
A utility for creating local artifacts for use with the [`aws cloudformation package`](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/package.html) command.

## Installation

```
$ npm install cfn-package
```

## Recursive NPM Install
Run `npm install` for each package that is not under `node_modules`.
```
cfn-packager install-subpackages
```

## Build AWS Resources
Run `npm run build-aws-resource` for each package that defines that script.
```
cfn-packager build-aws-resources
```

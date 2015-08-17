## env-validator

Ensure that your Node app is running in a valid environment.

Call the validator to check that:

- You're on the right Node version at runtime
- All the required environment variables have been set

In an effort to fail fast, we check these two important features up front.

## Install

```
npm install env-validator --save
```

## Usage

Put the following function call close to the beginning of your program:

```
import validate from 'env-validator'

const env = {
  nodeVersion: '0.12.x'
  varNames: [
    'GITHUB_OAUTH_CLIENT_ID',
    'GITHUB_OAUTH_CLIENT_SECRET'
  ]
}
validate(env)

// the rest of your app below
```

## Environment Config

Put the following properties in your `env` config object:

`nodeVersion` - (String) - Give a full `major.minor.patch` version of Node.js.  Where you want to be variable, use an `x`, as in `0.13.x`.  Will throw an error if the Node version is not at least as high as what is expected.  Compares with `process.version`.

`varNames` - (Array<String>) - The names of environment variables that must be set in order for your app to work.  Will throw an error indicating all the missing variables if they're not available from `process.env`.


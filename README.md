# Grogqli

## Packages
### `@grogqli/server`
The backend api and client webserver

#### To develop on this
The `npm run start` of this project is enough to start the webserver and HMR server

#### To run in another app

```bash
npm i @groqli/server
```

in package.json
```json
{
  "scripts": {
    "grogqli": "grogqli"
  }
}

```

```bash
npm run grogqli
```

## Start Development Environment
* `npm run init` - clears out all `node_modules` and reinstalls dependencies
* `npm run start` - starts the development runtimes for each package

## Commands
### add a dependency
* `lerna add <name-of-package-to-import> packages/<name-of-importing-package>/`
* devDependencies - `lerna add <name-of-package-to-import> packages/<name-of-package>/ --dev`

### remove a dependency
* remove the reference in the associated `package.json`
* `npm run init`
# Groqli

## Packages
### `@groqli/manager`
The backend api and client webserver 

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
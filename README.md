# Grogqli

## Packages
### `@grogqli/server`
The backend api and client webserver
### `@grogqli/clients`
Various methods to consume data generated from `@grogqli/server`
### `@grogqli/schema`
The graphql schema SDLs, queries SDLs, and the generated Typescript types associated with each

## Development

### Start Development Environment
* `npm run dev` - clears out all `node_modules`, reinstalls dependencies, links packages, and starts the development runtimes for each package
* `npm run start` - starts the development runtimes for each package (helpful for quickly restarting the dev environment without reinitializing all dependencies, linking, etc).

### Notes
* If types don't seems to be properly updated after making changed (e.g. changes in `@grogqli/schema` not cascading to `@grogqli/server`):
  * in vscode: press f1 and then begin typing `reload window` and select the option for `Developer: Reload Window`

### Commands
#### Publish
* `npm run publish`

#### add a dependency
* `lerna add <name-of-package-to-import> packages/<name-of-importing-package>/`
* devDependencies - `lerna add <name-of-package-to-import> packages/<name-of-package>/ --dev`

#### remove a dependency
* remove the reference in the associated `package.json`
* `npm run init`
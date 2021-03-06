<p align="center"><img src="./grogqli.png" width="10%"/></p>

<h1 align="center">Grogqli</h2>
<h2 align="center">graphql response recorder</h2>

## Packages

### `@grogqli/server`

The backend api and client webserver

### `@grogqli/clients`

Various methods to consume data generated from `@grogqli/server`

### `@grogqli/schema`

The graphql schema SDLs, queries SDLs, and the generated Typescript types associated with each

## Development

### Start Development Environment

- `npm start` - clears out all `node_modules`, reinstalls dependencies, links packages, and starts the development runtimes for each package

### Lint on Save

To enable automatic prettier lint error correction on save (in vscode editor), install and enable the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Notes

- If types don't seems to be properly updated after making changed (e.g. changes in `@grogqli/schema` not cascading to `@grogqli/server`):
  - in vscode: press f1 and then begin typing `reload window` and select the option for `Developer: Reload Window`

### Commands

#### Publish

- `npm run publish`

#### Start development runtime

- `npm run start` - starts the development runtimes for each package (helpful for quickly restarting the dev environment without reinitializing all dependencies, linking, etc).

#### add a dependency (this method prevents breaking lerna symlinks during dev)

- `lerna add <name-of-package-to-import> packages/<name-of-importing-package>/`
- devDependencies - `lerna add <name-of-package-to-import> packages/<name-of-package>/ --dev`

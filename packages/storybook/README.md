# Grogqli Storybook Addon

## Setup

- install dependency

  ```bash
  npm i D @grogqli/storybook
  ```

- add addon reference to storybook configuration

  ```es5
  // .storybook/main.js

  module.exports = {
    addons: ['@grogqli/storybook']
  }
  ```

- add msw service worker to the storybook's public subdirectory

  - `mkdir public && npx msw init ./public`

- pass static assets option to npm storybook start script

  - `"storybook": "start-storybook -p 9001 -s ./public"`

- (optional) if storybook requires a path prefix (e.g. /static/someStaticAsset.ico) for static asset requests, this can be configured in the addon (this is mostly a concern for deployments):

  - method 1: via storybook parameters

  ```es5
  // .storybook/preview.js
  export const parameters = {
    grogqli: {
      publicPath: 'static'
    },
  };
  ```

  - method 2: via env vars
    - set the `STORYBOOK_GROGQLI_PUBLIC_PATH` env var either 1) inline storybook execution OR 2) in a .env file

- set schemaMappings
  - pass a string to string:string object that maps the schemaUrl(s) that are queried to the appropriate schemaId(s) found in the respective grogqli data
  ```typescript
  type SchemaMappings = {
    [schemaUrl: string]: string;
  };
  ```

## Development

- In monorepo root: `npm start`
  - installs dependencies
  - builds and links all packages of monorepo
  - starts this project's type checker and babel transpiler in watcher modes
- Method 1: As an addon in @grogqli/storybook's storybook (i.e. Dogfood)
  - In this package: `npm start`
    - runs the local storybook example that consumes this project's addon code
    - if type checker and transpilation are successful, storybook will be available at `http://localhost:6006`
- Method 2: As an addon in an external application's storybook
  - Follow the [Setup Instructions](#Setup) against the external application
  - Link the external application's `@grogqli/storybook` reference to this project
    - in the root directory of the external application, run the following:
    ```bash
    npm link ../grogqli/packages/storybook/
    ```
  - Add the `--no-manager-cache` flag to the external application's `storybook` script created in [Setup Instructions](#Setup)
    - e.g. `start-storybook -p 9001 -s ./public --no-manager-cache`

# Grogqli Storybook Addon

## To setup development environment

- In monorepo root: `npm start`
  - installs dependencies
  - builds and links all packages of monorepo
  - starts this project's type checker and babel transpiler in watcher modes
- In this package: `npm start`
  - runs the local storybook example that consumes this project's addon code
  - if type checker and transpilation are successful, storybook will be available at `http://localhost:6006`

## setup for consumer of this addon

- added msw service worker to the next.js public subdirectory

  - `mkdir public && npx msw init ./public`

- pass static assets option to npm storybook start script

  - `"storybook": "start-storybook -p 6006 -s public"`

- set the public assets path on line20 src/handler/index.ts

  - TODO have consumer set this outside of the addon code

- set env vars
  - publicPath
    - set the `STORYBOOK_GROGQLI_PUBLIC_PATH` env var either 1) inline storybook execution OR 2) in a .env file
  - schemaMappings
    - pass a string to string:string object that maps the schemaUrl(s) that are queried to the appropriate schemaId(s) found in the respective grogqli data
    ```typescript
    type SchemaMappings = {
      [schemaUrl: string]: string;
    };
    ```

# @grogqli/webapp

The react webapp that provides a UI for interacting with grogqli features.

## Development via Storybook

- in monorepo root: `npm start`

- in this package: `npm run storybook`

## What was done to add Grogqli to this project's Storybook workflow?

This assumes the grogqli server has a previously saved workflow:

- install grogqli addon

  - `npm i -D @grogqli/storybook`

- add reference to grogqli addon in `.storybook/main.js`

  ```es6
  // .storybook/main.js
  module.exports = {
    addons: ['@grogqli/storybook'],
    // ...other configs
  };
  ```

- added msw service worker to the next.js public subdirectory

  - `mkdir public && npx msw init ./public`

- pass static assets option to npm storybook start script

  - `"storybook": "start-storybook -p 6006 -s public"`

- set the links in apollo-client.ts to the same schemaUrl of the given schema recording

- setup params

  - TODO show this

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

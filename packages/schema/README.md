# @grogqli/schema

Source of truth for the gql schema and operation docs that powers grogqli packages.

## How to clear generated assets and rebuild from scratch

In this project's current state, changes to shared types will not correctly cascade to the files that import these. Consequently, the graphql-let cache needs to be manually busted to generate a correct set of assets:

- `rm -rf src/generated`
- `npm i`
- `npm run build:types`

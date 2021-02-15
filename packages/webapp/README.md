# @grogqli/webapp

The react webapp that provides a UI for interacting with grogqli features.

## What was done to add Grogqli to this project's Storybook workflow?

This assumes the grogqli server has a previously saved workflow:

- added use of `@grogqli/clients` in `.storybook/preview.js`

  - include the port value of the grogqli server (see below)

- added msw service worker to the next.js public subdirectory

  - `mkdir public && npx msw init ./public`

- pass static assets option to npm storybook start script

  - `"storybook": "start-storybook -p 6006 -s public"`

- run grogqli server instance at the same port referenced in `.storybook/preview.js`

Newly added:

- Moved initialization of handler to a loader and used a singleton pattern to only initialize this once per hard refresh (e.g. dont reinitialize listener each time a story loads)

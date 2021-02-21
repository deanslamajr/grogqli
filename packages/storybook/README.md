# Grogqli Storybook Addon

## handler

- building out storybook-specific handler in this project as poc
  - src/handler
  - TODO move this to grogqli monorepo

## setup for consumer of this addon
- added msw service worker to the next.js public subdirectory

  - `mkdir public && npx msw init ./public`

- pass static assets option to npm storybook start script

  - `"storybook": "start-storybook -p 6006 -s public"`

- TODO need to verify the service worker is being included in the published build assets 
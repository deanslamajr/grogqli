# Next.js + Grogqli Example

This example extends the [with-typescript-graphql (off commit hash a2bea9b4)](https://github.com/vercel/next.js/tree/a2bea9b49293c33fd7f2f68baa103aa18c623ebe/examples/with-typescript-graphql) Next.js example project.

## To run locally

- `npm i && npm run dev`

- (in a separate terminal window) `npm run grogqli`

- in a browser window, navigate to `localhost:3000`

## What was done to add Grogqli to this Next.js project

- installed grogqli server and client

  - `npm i -D @grogqli/server @grogqli/clients`

- added grogqli npm command to package.json

```json
"scripts": {
  "grogqli": "grogqli"
}
```

- added a file `grogqli.json` to the project root:

```json
{
  "recordingsSaveDirectory": "./src/mocks",
  "recordingsFilename": "rec"
}
```

- added msw service worker to the next.js public subdirectory

  - `npx msw init ./public`

- initialize the service worker and mount the client in `pages/_app.tsx`

```typescript
// pages/_app.tsx
import { mountClient, startServiceWorker } from "@grogqli/clients";

startServiceWorker();
mountClient();
```

- update `.gitignore` to prevent committing temporary grogqli recordings

```.gitignore
# grogqli
grogqli/local
```

## To dev against local grogqli with this example

- in grogqli root, `npm run start`

- in this example root, `npm run dev`

- In this configuration, grogqli settings will be sourced from the @grogqli/server subdirectory (ie `grogqli/packages/server/grogqli.json`). Consequently, assets generated (eg recordings) will be found in that subdirectory (eg `grogqli/packages/server/grogqli`)
/**
 * A decorator is a way to wrap a story in extra “rendering” functionality. Many addons define decorators
 * in order to augment stories:
 * - with extra rendering
 * - gather details about how a story is rendered
 *
 * When writing stories, decorators are typically used to wrap stories with extra markup or context mocking.
 *
 * https://storybook.js.org/docs/react/writing-stories/decorators#gatsby-focus-wrapper
 */
import { withGlobals } from "../withGlobals";
import { withRoundTrip } from "../withRoundTrip";

export const decorators = [withGlobals, withRoundTrip];

let handlerSessionId;

export const loaders = [
  async () => {
    if (!handlerSessionId) {
      const { HandlerState: Modes } = require('@grogqli/schema');
      const { mountClient, startServiceWorker } = require('@grogqli/clients');

      // TODO allow this to be set by storybook config??
      // port that @grogqli/server's dev server is normally set to
      const port = 1234;

      handlerSessionId = await startServiceWorker({
        initialMode: Modes.Playback,
        // TODO make dynamic
        initialWorkflowId: '8h9kLygAkmQ',
        port,
      });

      console.log(
        '@grogqli/webapp > new grogqli handler session created, id:',
        handlerSessionId
      );

      // mountClient({
      //   initialSessionId: sessionId,
      //   port,
      // });
    }
  },
];
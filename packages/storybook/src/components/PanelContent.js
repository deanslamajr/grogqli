import React, { Fragment } from "react";
import { styled, themes, convert } from "@storybook/theming";
import { TabsState, Placeholder, Button } from "@storybook/components";
import { List } from "./List";

export const RequestDataButton = styled(Button)({
  marginTop: "1rem",
});

/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent = ({ results, fetchData, clearData }) => (
  <TabsState
    initial="workflow"
    backgroundColor={convert(themes.normal).background.hoverable}
  >
    <div
      id="workflow"
      title="Workflow"
      color={convert(themes.normal).color.positive}
    >
      <Placeholder>
        <Fragment>
          TODO - add Select with workflow options
        </Fragment>
      </Placeholder>
    </div>
    <div
      id="mocks"
      title="Mocks"
      color={convert(themes.normal).color.seafoam}
    >
      <Placeholder>
        <Fragment>
          TODO - add Mock data view here
        </Fragment>
      </Placeholder>
    </div>
    <div
      id="console"
      title="Console"
      color={convert(themes.normal).color.purple}
    >
      <Placeholder>
        <Fragment>
          TODO - add Console data view here
        </Fragment>
      </Placeholder>
    </div>
  </TabsState>
);

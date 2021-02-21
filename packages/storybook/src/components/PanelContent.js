import React, { Fragment } from "react";
import { styled, themes, convert } from "@storybook/theming";
import { TabsState, Placeholder, Button } from "@storybook/components";
import { useParameter } from "@storybook/api";

import { PARAM_KEY } from "../constants";

import {WorkflowConfigurationView} from './WorkflowConfigurationView';

/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent = () => {
  // https://storybook.js.org/docs/react/addons/addons-api#useparameter
  const {
    defaultWorkflowId,
    workflowIds
  } = useParameter(PARAM_KEY, []);

  const workflowsExist = workflowIds && workflowIds.length;

  return (
    <TabsState
      initial="workflow"
      backgroundColor={convert(themes.normal).background.hoverable}
    >
      <div
        id="workflow"
        title="Workflow"
        color={convert(themes.normal).color.seafoam}
      >
        {workflowsExist
          ? <WorkflowConfigurationView
            defaultWorkflowId={defaultWorkflowId}
            workflowIds={workflowIds}
          />
          : null}
      </div>
      <div
        id="console"
        title="Console"
        color={convert(themes.normal).color.positive}
      >
        <Placeholder>
          <Fragment>
            TODO - add Console data view here
          </Fragment>
        </Placeholder>
      </div>
    </TabsState>
  )
};

import React, { Fragment } from 'react';
import { themes, convert } from '@storybook/theming';
import { TabsState, Placeholder, Button } from '@storybook/components';
import { useChannel, useParameter } from '@storybook/api';

import { IntOp, Notification } from '../interfaces';
import { EVENTS, PARAM_KEY } from '../constants';

import { WorkflowConfigurationView } from './WorkflowConfigurationView';

interface GrogqliParameters {
  defaultWorkflowId?: string;
  workflowIds?: string[];
}

const WORKFLOW = 'WORKFLOW';
const CONSOLE = 'CONSOLE';

/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent = () => {
  // https://storybook.js.org/docs/react/addons/addons-api#useparameter
  const { defaultWorkflowId, workflowIds } = useParameter<GrogqliParameters>(
    PARAM_KEY,
    {} as GrogqliParameters
  );

  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const emit = useChannel({
    [EVENTS.NEED_HELP_WITH_MOCK]: (intOp: IntOp) =>
      setNotifications((notifications) => {
        const copyOfNotifications = Array.from(notifications);
        const newNotification: Notification = {
          id: intOp.timestamp,
          type: 'unhandled_mock',
          values: intOp,
          isResolved: false,
        };
        copyOfNotifications.push(newNotification);
        return copyOfNotifications;
      }),
  });

  const workflowsExist = Array.isArray(workflowIds) && workflowIds.length > 0;

  return (
    <TabsState
      initial={workflowsExist ? WORKFLOW : CONSOLE}
      backgroundColor={convert(themes.normal).background.hoverable}
    >
      {workflowsExist ? (
        <div
          id={WORKFLOW}
          title="Workflow"
          color={convert(themes.normal).color.seafoam}
        >
          <WorkflowConfigurationView
            defaultWorkflowId={defaultWorkflowId}
            workflowIds={workflowIds!}
          />
        </div>
      ) : null}
      <div
        id={CONSOLE}
        title="Console"
        color={convert(themes.normal).color.positive}
      >
        {notifications.length > 0 ? (
          <>
            {notifications
              .sort((n1, n2) => n2.id - n1.id)
              .map((notification) => (
                <div key={notification.id}>
                  <div>{JSON.stringify(notification)}</div>
                  <Button
                    small
                    outline
                    primary={!notification.isResolved}
                    disabled={notification.isResolved}
                    onClick={() => {
                      emit(EVENTS.NEED_HELP_WITH_MOCK_RESPONSE, notification);
                      setNotifications((notifications) => {
                        const copyOfNotifications = Array.from(notifications);
                        const activeNotification = copyOfNotifications.find(
                          (n) => notification.id === n.id
                        );
                        if (activeNotification) {
                          activeNotification.isResolved = true;
                        }
                        return copyOfNotifications;
                      });
                    }}
                  >
                    {notification.isResolved ? 'Set Mock' : 'Mock set'}
                  </Button>
                </div>
              ))}
          </>
        ) : (
          <Placeholder>
            <Fragment>Empty</Fragment>
          </Placeholder>
        )}
      </div>
    </TabsState>
  );
};

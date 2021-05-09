export type Notification = {
  id: number;
  type: 'unhandled_mock';
  values: object;
  isResolved: boolean;
};

export type IntOp = {
  timestamp: number;
  schemaUrl: string;
  workflowId: string;
  query: string;
  variables: object;
};

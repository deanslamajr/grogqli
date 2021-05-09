import React from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

const defaultReactJsonProps: ReactJsonViewProps = {
  name: false,
  indentWidth: 2,
  enableClipboard: false,
  displayDataTypes: false,
  displayObjectSize: false,
  sortKeys: true,
  collapsed: true,
  // @ts-ignore
  quotesOnKeys: false,
};

export type ResponseProps = {
  responseString?: string;
};

export const Response: React.FC<ResponseProps> = ({ responseString }) => {
  const [response, setResponse] = React.useState<object | null>(null);
  React.useEffect(() => {
    if (responseString !== undefined) {
      const parsedResponse = JSON.parse(responseString);
      setResponse(parsedResponse);
    }
  }, []);

  return (
    response && (
      <div>
        <div>Response</div>
        <ReactJson {...defaultReactJsonProps} src={response} />
      </div>
    )
  );
};

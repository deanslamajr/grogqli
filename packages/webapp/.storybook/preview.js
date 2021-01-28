import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

export const decorators = [
  (Story, { args: { url } }) => (
    <MemoryRouter initialEntries={[url]}>
      <Route
        render={({ location }) => (
          <>
            <div>{`${location.pathname}${location.search}`}</div>
            <Story />
          </>
        )}
      />
    </MemoryRouter>
  ),
];

import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { GetWorkflows } from '@grogqli/schema';

const StyledMainSubMenuBar = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.sizes.menuBarHeight};
  background-color: ${({ theme }) => theme.colors.highGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  line-height: 1.75;
  font-size: 15px;
`;

const PlayButton = styled.span`
  cursor: pointer;
  margin: 0 5px;
  padding: 0 10px;
  display: inline-block;
  color: ${(props) => props.theme.colors.unselectedMenuItemText};

  &:hover {
    color: ${(props) => props.theme.colors.selectedMenuItemUnderline};
    background-color: ${({ theme }) => theme.colors.selectedMenuItemBackground};
  }
`;

const WorkflowsDropdown = styled.select`
  // A reset of styles, including removing the default dropdown arrow
  appearance: none;
  color: ${({ theme }) => theme.colors.selectedMenuItemText};
  background-color: ${({ theme }) => theme.colors.generalBackgroundColor};
  border: none;
  margin: 0 5px;
  padding: 0 5px;
  width: 300px;
  height: calc(${({ theme }) => theme.sizes.menuBarHeight} - 5px);
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;

  &:focus {
    outline: none;
  }
`;

export const MockingPage: React.FC<{}> = ({}) => {
  const { data, loading } = useQuery(GetWorkflows.GetWorkflowsDocument);

  return (
    <>
      <StyledMainSubMenuBar>
        {loading ? (
          'LOADING WORKFLOWS'
        ) : (
          <>
            <WorkflowsDropdown name="workflows">
              {data && data.workflows?.map ? (
                data.workflows.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))
              ) : (
                <option value="noValue">No Values</option>
              )}
            </WorkflowsDropdown>
            <PlayButton>USE MOCK</PlayButton>
          </>
        )}
      </StyledMainSubMenuBar>
    </>
  );
};

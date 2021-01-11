import React from 'react';
import styled from 'styled-components';

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
  return (
    <>
      <StyledMainSubMenuBar>
        <PlayButton>USE MOCK</PlayButton>
        <WorkflowsDropdown name="workflows">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </WorkflowsDropdown>
      </StyledMainSubMenuBar>
    </>
  );
};

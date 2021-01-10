import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { PageConfig } from './';

const StyledOuterContainer = styled.div`
  width: 100%;
  height: 27px;
  background-color: ${({ theme }) => theme.colors.highGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  line-height: 1.75;
  font-size: 15px;
`;

const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.colors.unselectedMenuItemText};
  display: inline-block;
  height: 100%;
  padding: 0 15px 0;
  text-decoration: none;
  cursor: pointer;

  &.active {
    color: ${({ theme }) => theme.colors.selectedMenuItemText};
    border-bottom: 2px solid
      ${({ theme }) => theme.colors.selectedMenuItemUnderline};

    &:hover {
      background-color: inherit;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.selectedMenuItemBackground};
  }
`;

interface Props {
  pagesConfig: PageConfig[];
}
export const TopNavBar: React.FC<Props> = ({ pagesConfig }) => {
  return (
    <StyledOuterContainer>
      {pagesConfig.map(({ label, path }) => (
        <StyledLink key={path} to={path}>
          {label}
        </StyledLink>
      ))}
    </StyledOuterContainer>
  );
};

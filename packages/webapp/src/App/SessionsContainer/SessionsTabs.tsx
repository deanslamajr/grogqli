import React from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';
import { Handler } from '@grogqli/schema';

const StyledOuterContainer = styled.nav`
  width: 100%;
  height: 35px;
  background-color: ${({ theme }) => theme.colors.sessionMenuBackgroundDark};
  line-height: 2.2;
`;

// const StyledUnorderedList = styled.ul`
//   padding: 0;
// `;

const StyledMenuItem = styled.span<{ isActive: boolean }>`
  color: ${(props) =>
    props.isActive
      ? props.theme.colors.selectedMenuItemText
      : props.theme.colors.unselectedMenuItemText};
  width: 25%;
  display: inline-block;
  padding: 0 15px 0;
  cursor: pointer;
  height: 35px;
  font-size: 16px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.highGray : theme.colors.sessionMenuBackgroundDark};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.highGray : theme.colors.borders};
  }
`;

interface Props {
  changeSession: (newSessionId: string) => void;
  sessions: Handler[] | null;
}

export const SessionsTabs: React.FC<Props> = ({ changeSession, sessions }) => {
  const { params } = useRouteMatch<{ sessionId: string }>();
  return (
    <StyledOuterContainer>
      {/* <StyledUnorderedList> */}
      {sessions &&
        sessions.map(({ id, name }) => (
          <StyledMenuItem
            key={id}
            isActive={id === params.sessionId}
            onClick={() => changeSession(id)}
          >
            {name}
          </StyledMenuItem>
        ))}
      {/* </StyledUnorderedList> */}
    </StyledOuterContainer>
  );
};

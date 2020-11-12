import React, { FC } from 'react';
import styled from 'styled-components';

interface SaveDrawerProps {
  show: boolean;
}

const SaveDrawerContainer = styled.div<{ show: boolean }>`
  position: absolute;
  width: 100%;
  height: ${(props) => (props.show ? '100%' : 0)};
  top: ${(props) => (props.show ? 0 : '100%')};
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.whiteDark};
  color: ${(props) => props.theme.colors.black};
  transition: all 0.25s;
`;

export const SaveDrawer: FC<SaveDrawerProps> = ({ show }) => {
  return <SaveDrawerContainer show={show} />;
};

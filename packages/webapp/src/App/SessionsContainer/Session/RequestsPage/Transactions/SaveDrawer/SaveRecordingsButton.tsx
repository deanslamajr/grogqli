import React, { FC } from 'react';
import { VscCheck } from 'react-icons/vsc';

import { NavButtonPositions, NavButton } from '../NavButton';
import { cssTheme } from '../../../../../constants';

interface SaveRecordingButtonProps {
  onClick: () => void;
}

export const SaveRecordingsButton: FC<SaveRecordingButtonProps> = ({
  onClick,
}) => {
  return (
    <NavButton
      position={NavButtonPositions.BottomRight}
      clickHandler={onClick}
      icon={
        <VscCheck
          color={cssTheme.colors.green}
          size={cssTheme.sizes.navbarButtonIconSize}
        />
      }
    />
  );
};

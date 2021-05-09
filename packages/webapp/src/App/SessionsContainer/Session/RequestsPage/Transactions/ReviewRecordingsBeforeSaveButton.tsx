import React, { FC } from 'react';
import { VscSave, VscClose } from 'react-icons/vsc';

import { NavButtonPositions, NavButton } from './NavButton';
import { cssTheme } from '../../../../constants';

interface SaveRecordingButtonProps {
  onClick: () => void;
  showSaveIcon: boolean;
}

export const ReviewRecordingsBeforeSaveButton: FC<SaveRecordingButtonProps> = ({
  onClick,
  showSaveIcon,
}) => {
  return (
    <NavButton
      position={
        showSaveIcon
          ? NavButtonPositions.BottomRight
          : NavButtonPositions.BottomLeft
      }
      clickHandler={onClick}
      icon={
        showSaveIcon ? (
          <VscSave
            color={cssTheme.colors.green}
            size={cssTheme.sizes.navbarButtonIconSize}
          />
        ) : (
          <VscClose
            color={cssTheme.colors.red}
            size={cssTheme.sizes.navbarButtonIconSize}
          />
        )
      }
    />
  );
};

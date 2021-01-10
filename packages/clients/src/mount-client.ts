const iFrameSingletonKey = '__iFrameSingleton';
const grogqliAppIFrameId = 'grogqli-app';
const groqliAppUrl = 'http://localhost:4000';

const grogqliContainerStyles = {
  base: `
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
  `,
  collapsed: `
    height: 0;
    min-height: 0;
    max-height: 0;
  `,
  expanded: `
    height: 50vh;
    min-height: 12rem;
    max-height: 100%;
  `,
};

const newWindowButtonStyles = {
  base: `
    cursor: pointer;
    width: 50px;
    height: 50px;
    min-height: 50px;
  `,
  icon: `
    background:
      url('data:image/png;base64,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')
        no-repeat
        left center,
      rgba(240, 248, 255, 1);
  `,
};

export const mountClient = () => {
  // if in a browser context
  //   AND if iframe hasn't already been created i.e. if this isn't a HMR reload
  if (typeof window !== 'undefined' && !window[iFrameSingletonKey]) {
    const grogqliAppIFrame = (window[
      iFrameSingletonKey
    ] = document.createElement('iframe'));
    grogqliAppIFrame.setAttribute('src', groqliAppUrl);
    grogqliAppIFrame.setAttribute('id', grogqliAppIFrameId);
    grogqliAppIFrame.style.cssText = `
      width: 100%;
      height: 100%;
      border-top: 1px solid rgba(208, 208, 208, 1);
    `;

    const grogqliContainer = document.createElement('div');
    grogqliContainer.style.cssText = `
      ${grogqliContainerStyles.base}
      ${grogqliContainerStyles.collapsed}
    `;

    const showAppIframe = () => {
      grogqliContainer.style.cssText = `
        ${grogqliContainerStyles.base}
        ${grogqliContainerStyles.expanded}
      `;
      grogqliContainer.appendChild(grogqliAppIFrame);
    };

    const hideAppIframe = () => {
      grogqliContainer.style.cssText = `
        ${grogqliContainerStyles.base}
        ${grogqliContainerStyles.collapsed}
      `;
      grogqliAppIFrame.remove();
    };

    const newWindowButton = document.createElement('input');
    newWindowButton.setAttribute('type', 'button');
    newWindowButton.style.cssText = `
      ${newWindowButtonStyles.base}
      ${newWindowButtonStyles.icon}
    `;

    const openAppAsNewWindow = () => {
      window.open(groqliAppUrl);
      hideAppIframe();

      newWindowButton.removeEventListener('click', openAppAsNewWindow);
      newWindowButton.addEventListener('click', openAppAsIframe);
    };

    const openAppAsIframe = () => {
      showAppIframe();
      newWindowButton.removeEventListener('click', openAppAsIframe);
      newWindowButton.addEventListener('click', openAppAsNewWindow);
    };

    newWindowButton.addEventListener('click', openAppAsIframe);

    grogqliContainer.appendChild(newWindowButton);
    document.body.appendChild(grogqliContainer);
  }
};

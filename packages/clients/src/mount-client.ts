const iFrameSingletonKey = '__iFrameSingleton';
const iFrameId = 'groqli-client';
const groqliAppUrl = 'http://localhost:4000';

export const mountClient = () => {
  // if in a browser context
  //   AND if iframe hasn't already been created i.e. if this isn't a HMR reload 
  if (typeof window !== 'undefined' && !window[iFrameSingletonKey]) {
    const iFrame = window[iFrameSingletonKey] = document.createElement('iframe');

    iFrame.setAttribute('id', iFrameId);
    iFrame.style.cssText = `
      position: fixed;
      top: .75rem;
      right: .75rem;
      width: 400px;
      height: 400px;
      border: black;
      box-shadow: 0 6px 14px 0 #666;
      border-radius: .15em;
    `;

    document.body.appendChild(iFrame);

    iFrame.setAttribute('src', groqliAppUrl);
  }
};
import styled, { css } from 'styled-components';

export const formFieldStyles = () => {
  return css`
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};
    width: ${({ theme }) => theme.sizes.formFieldWidth};
    min-height: unset;
    font-family: ${({ theme }) => theme.font};
    font-size: 16px;
    padding: 0.5rem 0 !important;
  `;
};

export const FormFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 2rem;
  align-items: center;

  & input,
  & textarea {
    ${formFieldStyles()}
  }

  & input {
    height: unset;
  }

  & textarea {
    height: 7rem;
    resize: none;
  }
`;

export const InvalidFieldMessage = styled.div`
  color: ${({ theme }) => theme.colors.red};
  height: 1rem;
  padding: 0.15rem;
`;

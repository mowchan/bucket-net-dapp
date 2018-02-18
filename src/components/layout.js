import styled, {css} from 'styled-components';
import {BORDER_RADIUS, COLOR, FONT, HOVER} from './variables';

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background-color: ${COLOR.GRAY_DARK};

  h1 {
    margin: 0;
    color: ${COLOR.WHITE};
    font-family: ${FONT.MONO};
    font-size: 20px;
    letter-spacing: 5px;
    line-height: 52px;
    text-transform: lowercase;
  }
`;

export const AddGrow = styled.button`
  margin: 10px 0;
  border: 0;
  border-radius: ${BORDER_RADIUS};
  padding-left: 12px;
  padding-right: 12px;
  color: ${COLOR.WHITE};
  transition: all 150ms ease;
  font-family: ${FONT.MONO};
  font-size: 13px;
  line-height: 13px;

  svg {
    position: relative;
    top: -1px;
    margin-left: 8px;
  }

  ${props => !props.disabled && css`
    background-color: ${COLOR.GREEN};
    ${HOVER}
  `}

  ${props => !!props.disabled && css`
    cursor: not-allowed;
    background-color: ${COLOR.GRAY};
  `}


`;

export const Modal = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  > button {
    cursor: pointer;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 0;
    width: 100%;
    background: ${COLOR.GRAY_DARK};
    opacity: 0.75;
  }

  > div {
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 32px;
    width: 400px;
    background-color: ${COLOR.WHITE};

    h1 {
      margin: 0 0 8px;
      border-bottom: 2px solid ${COLOR.GRAY_DARK};
      padding: 8px 0;
      font-size: 16px;
      line-height: 36px;
    }

    input,
    button {
      border: 0;
      border-radius: ${BORDER_RADIUS};
    }

    input {
      display: block;
      margin: 16px 0;
      padding: 8px 16px;
      width: calc(100% - 32px);
      font-family: ${FONT.MONO};
      font-size: 18px;
    }

    button {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 8px 16px;
      width: 100%;
      color: ${COLOR.WHITE};
      font-family: ${FONT.MONO};
      font-size: 18px;
      text-align: left;

      svg {
        font-size: 24px;
        margin-right: -5px;
      }

      ${props => !!props.disabled && css`
        cursor: not-allowed;
        background-color: ${COLOR.GRAY_DARK};
      `}

      ${props => !props.disabled && css`
        ${HOVER}
        background-color: ${COLOR.GREEN};
      `}
    }

    p {
      margin-bottom: 0;
      font-size: 12px;
    }
  }
`;

const Status = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  color: ${COLOR.WHITE};
  line-height: 52px;
  text-align: center;
`;

export const StatusHref = styled.a`
  ${Status};
  background-color: ${COLOR.GREEN};
`;

export const StatusNoHref = styled.div`
  ${Status};
  background-color: ${COLOR.RED};
`;

export const Container = styled.div`
  margin: 0 auto;
  width: 900px;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const MetaMask = styled.div`
  h1 {
    margin: 0 0 8px;
    border-bottom: 2px solid ${COLOR.RED};
    color: ${COLOR.RED};
    padding: 8px 0;
    font-size: 16px;
    line-height: 36px;
  }
`;

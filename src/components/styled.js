import styled, {css} from 'styled-components';
import {BORDER_RADIUS, COLOR, FONT, HOVER} from './variables';
import {SM_MAX, MD_MIN} from './media';

export const GrowCard = styled.div`
  padding: 16px 0;

  > div > div:first-of-type {
    margin: 0 0 8px;
    border-bottom: 2px solid ${COLOR.GRAY_DARK};
    align-items: center;
  }

  h1 {
    margin: 0;
    padding: 8px 0;
    font-size: 16px;
    line-height: 36px;
  }
`;

export const WebCamLink = styled.a`
  color: ${COLOR.GRAY_DARK};
  font-size: 24px;
`;

export const Reading = styled.div`
  position: relative;
  overflow: hidden;
  margin: 8px 0;
  border: 0;
  border-radius: ${BORDER_RADIUS};
  height: 0;
  background-color: ${COLOR.WHITE};
  color: ${COLOR.GRAY_DARK};

  ${SM_MAX`
    padding: 16px 16px 0;
    height: 90px;
    width: 100%;
  `}

  ${MD_MIN`
    flex: 1;
    padding: 16px 16px 20%;

    & + div {
      margin-left: 16px;
    }
  `}

  h2 {
    position: absolute;
    z-index: 1;
    margin: 0;
    font-family: ${FONT.MONO};
    font-size: 16px;

    & + div {
      position: absolute;
      left: 16px;

      ${SM_MAX`
        bottom: 6px;
      `}

      ${MD_MIN`
        bottom: 0;
      `}
    }
  }

  h3,
  span {
    display: inline;
  }

  h3 {
    font-family: ${FONT.MONO};

    ${SM_MAX`
      font-size: 48px;
    `}

    ${MD_MIN`
      font-size: 78px;
    `}
  }

  span {
    position: relative;
    top: 25px;
    vertical-align: top;
    font-size: 16px;
    opacity: 0.5;
  }
`;

export const Toggle = styled.button`
  border: 0;
  border-radius: ${BORDER_RADIUS};
  padding: 12px 16px;
  color: ${COLOR.WHITE};

  ${SM_MAX`
    margin: 4px 0;
    width: calc(50% - 4px);

    &:nth-of-type(1),
    &:nth-of-type(2) {
      margin-top: 8px;
    }
  `}

  ${MD_MIN`
    flex: 1;
    margin: 8px 0 16px;

    & + button {
      margin-left: 16px;
    }
  `}

  h2 {
    flex: 1;
    margin: 0;
    text-align: left;
  }

  svg {
    font-size: 21px;
    margin: 0 8px;
  }

  h2,
  span {
    font-family: ${FONT.MONO};
  }

  span {
    border-radius: ${BORDER_RADIUS};
    padding-left: 6px;
    padding-right: 6px;
    line-height: 20px;
    text-transform: uppercase;
  }

  ${props => !!props.enabled && css`
    background-color: ${COLOR.GREEN};

    span {
      background-color: ${COLOR.GREEN_DARK};
    }
  `}

  ${props => !props.enabled && css`
    background-color: ${COLOR.RED};

    span {
      background-color: ${COLOR.RED_DARK};
    }
  `}

  ${props => !!props.disabled && css`
    cursor: not-allowed;
    background-color: ${COLOR.GRAY_DARK};
  `}

  ${props => !props.disabled && css`
    ${HOVER}
  `}
`;

export const ChartWrapper = styled.div`
  position: absolute;
  top: 0;
  left: -5%;
  right: -5%;
  bottom: 0;
`;

import styled, {css} from 'styled-components';
import {BORDER_RADIUS, COLOR, FONT, HOVER} from './variables';

export const GrowCard = styled.div`
  padding: 16px 0;

  h1 {
    margin: 0 0 8px;
    border-bottom: 2px solid ${COLOR.GRAY_DARK};
    padding: 8px 0;
    font-size: 16px;
    line-height: 36px;
  }
`;

export const Reading = styled.div`
  position: relative;
  overflow: hidden;
  flex: 1;
  margin: 8px 0;
  border: 0;
  border-radius: ${BORDER_RADIUS};
  padding: 16px 16px 0;
  background-color: ${COLOR.WHITE};
  color: ${COLOR.GRAY_DARK};

  & + div {
    margin-left: 16px;
  }

  h2 {
    position: absolute;
    z-index: 1;
    margin: 0;
    font-family: ${FONT.MONO};
    font-size: 16px;

    & + div {
      margin-top: 68px;
    }
  }

  h3,
  span {
    display: inline;
  }

  h3 {
    font-family: ${FONT.MONO};
    font-size: 78px;
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
  flex: 1;
  margin: 8px 0 16px;
  border: 0;
  border-radius: ${BORDER_RADIUS};
  padding: 12px 16px;
  color: ${COLOR.WHITE};

  & + button {
    margin-left: 16px;
  }

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
  top: 5px;
  left: -5px;
  right: -5px;
  bottom: 0;
`;

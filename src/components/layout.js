import styled from 'styled-components';
import {BORDER_RADIUS, COLOR, FONT, HOVER} from './variables';

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
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
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${COLOR.GRAY_DARK};
  color: ${COLOR.WHITE};
  transition: all 150ms ease;
  font-size: 13px;
  line-height: 13px;

  svg {
    position: relative;
    top: -1px;
  }

  ${HOVER}
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

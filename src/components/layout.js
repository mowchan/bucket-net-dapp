import styled from 'styled-components';
import {BORDER_RADIUS, COLOR, FONT, HOVER} from './variables';

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: ${COLOR.GRAY_LIGHTER};

  h1 {
    margin: 0;
    color: ${COLOR.GRAY_DARK};
    font-family: ${FONT.MONO};
    font-size: 20px;
    line-height: 52px;
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

export const Container = styled.div`
  margin: 0 auto;
  width: 900px;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

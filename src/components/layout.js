import styled from 'styled-components';
import {COLOR} from './variables';

export const Header = styled.header`
  background-color: ${COLOR.GREEN};

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: lighter;
    line-height: 46px;
  }
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

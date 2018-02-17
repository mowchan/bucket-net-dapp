import styled, {css} from 'styled-components';
import {COLOR} from './variables';

export const GrowCard = styled.div`
  padding: 16px 0;

  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 36px;
  }
`;

export const Reading = styled.div`
  flex: 1;
  margin: 16px 0;
  border-radius: 3px;
  padding: 8px;
  background-color: #fff;

  & + & {
    margin-left: 16px;
  }

  h2 {
    margin: 0;
    font-size: 16px;
  }
`;

export const Toggle = styled.button`
  flex: 1;
  margin-bottom: 16px;
  border-radius: 18px;
  padding: 8px 16px;
  background-color: #fff;

  & + button {
    margin-left: 16px;
  }

  h2 {
    display: inline;
    margin: 0;
  }

  &:after {
    position: relative;
    top: 2px;
    margin-left: 8px;
    display: inline-block;
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 8px;
  }

  ${props => !!props.enabled && css`
    &:after {
      background-color: green;
    }
  `}

  ${props => !props.enabled && css`
    &:after {
      background-color: red;
    }
  `}
`;

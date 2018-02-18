import {css} from 'styled-components';

const lg = 960;
const md = 620;

function breakpointMin(pixels) {
  return pixels + 'px';
}

function breakpointMax(pixels) {
  return pixels - 1 + 'px';
}

const SM_MAX = (...args) => css`
  @media (max-width: ${breakpointMax(md)}) {
    ${css(...args)}
  }
`;

const MD_MIN = (...args) => css`
  @media (min-width: ${breakpointMin(md)}) {
    ${css(...args)}
  }
`;

const MD_MAX = (...args) => css`
  @media (max-width: ${breakpointMax(lg)}) {
    ${css(...args)}
  }
`;

const LG_MIN = (...args) => css`
  @media (min-width: ${breakpointMin(lg)}) {
    ${css(...args)}
  }
`;

export {
  SM_MAX,
  MD_MIN,
  MD_MAX,
  LG_MIN
};

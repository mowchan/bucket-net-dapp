export const COLOR = {
  WHITE: '#EDEDED',
  GRAY: '#5B6165',
  GRAY_DARK: '#323232',
  GRAY_LIGHT: '#B1B1B1',
  GRAY_LIGHTER: '#DCDCDC',
  GREEN: '#527F2D',
  GREEN_DARK: '#3A5920',
  RED: '#D42F4D',
  RED_DARK: '#AC243D'
};

export const BORDER_RADIUS = '3px';

export const FONT = {
  MONO: 'Roboto Mono, monospaced'
};

export const HOVER = `
  transition: all 150ms ease;
  transform: scale(1);

  &:hover,
  &:focus {
    cursor: pointer;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus,
  &:active {
    outline: none;
  }
`;

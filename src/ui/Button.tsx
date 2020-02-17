import { modularScale, darken } from 'polished';
import styled from 'styled-components';

export const StyledButton = styled.button`
  outline: 0;
  padding: 1em 3em;
  border-radius: 5px;
  font-family: Aileron;
  font-weight: 500;
  font-size: ${modularScale(0.1)};
  background-color: ${props => props.theme.colors.brand};
  color: white;
  cursor: pointer;
  border: ${props => `2px solid ${props.theme.colors.brand}`};

  transition: 0.1s transform;
  :hover {
    transform: scale(1.01);
  }

  :active {
    background-color: ${props => darken(0.1, props.theme.colors.brand)}
  }

`;

export default StyledButton;

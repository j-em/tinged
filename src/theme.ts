import palx from "palx";
import { DefaultTheme } from "styled-components";

export const colors = palx("#5858ad");

const theme: DefaultTheme = {
  colors: {
    brand: "#5858ad",
    secondary: colors.gray
  }
};

export default theme;

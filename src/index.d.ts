import "styled-components";

declare module "*.png";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      brand: string;
      secondary: string[];
    };
  }
}

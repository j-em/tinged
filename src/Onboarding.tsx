import React from "react";
import { FaMusic, FaReact, FaSearch } from "react-icons/fa";
import { useMedia } from "react-use";
import styled from "styled-components";
import media from "styled-media-query";
import { color, ColorStyleProps, fontSize, FontSizeProps } from "styled-system";
import Button from "ui/Button";

import theme from "./theme";

const Heading = styled.h1<FontSizeProps & ColorStyleProps>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  font-family: Aileron;
  color: ${({ theme }) => theme.colors.secondary[9]};
  ${fontSize}
  ${color}
`;

const IconWrapper = styled.div`
  margin-right: 0.5rem;
  display: flex;
`;

const Text = styled.p`
  font-family: Aileron;
  color: ${({ theme }) => theme.colors.secondary[9]};
`;

const Section = styled.section``;

const Footer = styled.footer`
  padding: 1rem;
  ${Button} {
    display: block;
    margin-left: auto;
    width: 100%;
    ${media.greaterThan("medium")`
      width: auto;
    `}
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  ${Heading} {
    margin: 0;
  }
`;

type OnboardingProps = { onStarted?: () => void; className?: string };
const Onboarding: React.FC<OnboardingProps> = ({ onStarted, className }) => {
  const isDesktop = useMedia("(min-width: 768px)", false);

  return (
    <div className={className}>
      <Header>
        <Heading fontSize={8}>Tinged</Heading>
        <Heading fontSize={4}>A modern and powerful media player</Heading>
      </Header>

      <Section>
        <Heading fontSize={3}>
          <IconWrapper>
            <FaMusic />
          </IconWrapper>
          Listen to your favorite hits
        </Heading>

        <Text>
          Enjoy your favorite songs using a beautiful and clutter-free
          interface.
        </Text>
      </Section>

      <Section>
        <Heading fontSize={4}>
          <IconWrapper>
            <FaSearch />
          </IconWrapper>
          Find your favorite hits
        </Heading>
        <Text>
          Search through your Tinged library to find the hits that you want
          quickly.
        </Text>
      </Section>

      <Section>
        <Heading fontSize={4}>
          <IconWrapper>
            <FaReact />
          </IconWrapper>
           Made with modern technologies
        </Heading>

        <Text>
          Tinged runs on Electron and was implemented using TypeScript and
          React.
        </Text>
      </Section>

      <Footer>
        <Button onClick={onStarted}>Start</Button>
      </Footer>
    </div>
  );
};

const StyledOnboarding = styled(Onboarding)`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;

  ${Header} {
    padding: 2rem;
  }

  ${Section} {
    flex: 1;
    padding: 2rem;
    :nth-of-type(2) {
      border-top: ${({ theme }) => `1px solid ${theme.colors.secondary[1]}`};
      border-bottom: ${({ theme }) => `1px solid ${theme.colors.secondary[1]}`};

      background-color: ${({ theme }) => theme.colors.secondary[0]};

      ${Text} {
        color: ${({ theme }) => theme.colors.secondary[8]};
        font-weight: 500;
      }
      ${Heading} {
        color: ${({ theme }) => theme.colors.secondary[8]};
      }

      ${media.greaterThan("medium")`
      text-align: right;
    `}
    }
  }
`;

export default StyledOnboarding;

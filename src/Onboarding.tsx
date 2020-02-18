import React from "react";
import { FaMusic, FaReact, FaSmile } from "react-icons/fa";
import styled from "styled-components";
import Button from "ui/Button";

const Heading = styled.h1`
  font-family: Aileron;
  margin: 0;
  font-size: 4rem;
`;

const List = styled.ul`
  font-family: Aileron;
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
`;

const ListElement = styled.li`
  color: ${props => props.theme.colors.secondary[9]};
  margin: 5px 0 0 0;
  padding: 0;
`;

type OnboardingProps = { onStarted?: () => void; className?: string };
const Onboarding: React.FC<OnboardingProps> = ({ onStarted, className }) => {
  return (
    <div className={className}>
      <Heading>Tinged.</Heading>

      <List>
        <ListElement>
          <FaMusic /> Listen to your favorite songs
        </ListElement>

        <ListElement>
          <FaSmile /> Using a clean and neat interface
        </ListElement>

        <ListElement>
          <FaReact /> Made with modern web technologies
        </ListElement>
      </List>

      <Button onClick={onStarted}>Start</Button>
    </div>
  );
};

const StyledOnboarding = styled(Onboarding)`
  display: flex;
  flex-direction: column;
  height: 100%;

  ${Heading} {
    flex: 1;
    margin-left: 2rem;
    margin-top: 2rem;
  }

  ${List} {
    flex: 3;
    margin-left: 2rem;
    margin-top: 3rem;
    margin-bottom: 3rem;
  }

  ${Button} {
    margin: auto 2rem 2rem 2rem;
    font-size: 1.5rem;
  }
`;

export default StyledOnboarding;

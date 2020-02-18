import React from "react";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import styled from "styled-components";

const Control = styled.div`
  transition: 0.2s tranform;
  padding: 0 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    transform: scale(1.1);
  }
`;

type ControlsProps = {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  className?: string;
  playing: boolean;
};

const Controls: React.FC<ControlsProps> = ({
  className,
  onPause,
  onPlay,
  onStop,
  playing
}) => {
  return (
    <div className={className}>
      {!playing ? (
        <Control onClick={() => onPlay && onPlay()}>
          <FaPlay />
        </Control>
      ) : (
        <>
          <Control onClick={() => onPause && onPause()}>
            <FaPause />
          </Control>
          <Control onClick={() => onStop && onStop()}>
            <FaStop />
          </Control>
        </>
      )}
    </div>
  );
};

const StyledControls = styled(Controls)`
  cursor: pointer;
  color: ${props => props.theme.colors.secondary[7]};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export default StyledControls;

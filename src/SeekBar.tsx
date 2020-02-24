import React, { useState, useEffect } from "react";
import Slider, { Thumb } from "ui/Slider";
import styled from "styled-components";
import { colors } from "./theme";
import { modularScale } from "polished";

const Box = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-around;
}
`;

const Timestamp = styled.p`
  color: ${colors.gray[9]};
  font-family: Aileron;
`;

const TotalTimestamp = styled(Timestamp)`
  margin-left: 10px;
`;
const ElapsedTimestamp = styled(Timestamp)`
  margin-right: 10px;
`;

const prettyPrintSecond = (second: number): string =>
  second < 10 ? `0${second}` : second.toString();

const StyledSlider = styled(Slider)`
  background-color: ${colors.gray[2]};
  height: 5px;
  flex: 4;

  ${Thumb} {
    border-radius: 25px;
    background-color: ${colors.gray[7]};
  }
`;

type SeekBarProps = {
  value: number;

  seeking: boolean;

  onSeek?: (n: number) => void;
  onStartSeeking?: () => void;
  onStopSeeking?: () => void;

  max: number;
  className?: string;
  disabled?: boolean;
};
const SeekBar: React.FC<SeekBarProps> = ({
  value,
  onSeek,
  max,
  className,
  seeking,
  onStartSeeking,
  onStopSeeking,
  disabled
}) => {
  const [isHovering, setHovering] = useState(false);

  const isActive = isHovering || seeking;

  const elapsedMinute = Math.floor(value / 60);
  const elapsedSecond = Math.floor(value) - elapsedMinute * 60;

  const totalMinute = Math.floor(max / 60);
  const totalSecond = Math.floor(max) - totalMinute * 60;

  return (
    <Box
      className={className}
      onMouseMove={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <ElapsedTimestamp>
        {elapsedMinute}:{prettyPrintSecond(elapsedSecond)}
      </ElapsedTimestamp>

      <StyledSlider
        disabled={disabled}
        sliding={seeking}
        onStartSliding={onStartSeeking}
        onStopSliding={onStopSeeking}
        value={value}
        max={max}
        min={0}
        onChange={value => {
          if (onSeek) {
            onSeek(value);
          }
        }}
        hideThumb={!isActive}
        initialThumbSize={{ height: 10, width: 10 }}
      />

      <TotalTimestamp>
        {totalMinute}:{prettyPrintSecond(totalSecond)}
      </TotalTimestamp>
    </Box>
  );
};

export default styled(SeekBar)`
  transition: 0.5s opacity;

  opacity: ${props => (props.disabled ? 0.7 : 1)};

  ${Slider} {
    cursor: ${props => (props.disabled ? "initial" : "pointer")};
  }
`;

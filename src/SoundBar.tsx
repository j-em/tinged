import React, { useEffect, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import styled from "styled-components";
import Slider, { Thumb } from "ui/Slider";

import { colors } from "./theme";

const SoundSlider = styled(Slider)`
  background-color: ${colors.gray[3]};
  flex: 1;
  height: 4px;
  ${Thumb} {
    background-color: ${colors.gray[7]};
    border-radius: 25px;
  }
`;

const VolumeIcon = styled(FaVolumeUp)`
  color: ${colors.gray[7]};
  margin-right: 10px;
`;

type SoundBarProps = {
  className?: string;
  value?: number;
  onChange?: (v: number) => void;
  onMute?: () => void;
};
const SoundBar: React.FC<SoundBarProps> = ({
  className,
  value = 0,
  onChange,
  onMute
}) => {
  const [isSliding, setSliding] = useState(false);
  const [isHovering, setHovering] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <VolumeIcon onClick={() => onMute && onMute()} />
      {
        <SoundSlider
          sliding={isSliding}
          onStartSliding={() => setSliding(true)}
          onStopSliding={() => setSliding(false)}
          value={value}
          max={100}
          onChange={onChange}
          hideThumb={!(isHovering || isSliding)}
          initialThumbSize={{ height: 10, width: 10 }}
        />
      }
    </div>
  );
};

const StyledSoundBar = styled(SoundBar)`
  min-height: 5px;
  display: flex;
  align-items: center;
  flex-direction: row;

  ${VolumeIcon} {
    padding-right: 5px;
  }
`;

export default StyledSoundBar;

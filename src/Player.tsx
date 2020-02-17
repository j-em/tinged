import { modularScale } from "polished";
import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";

import Controls from "./Controls";
import SeekBar from "./SeekBar";
import SoundBar from "./SoundBar";
import { colors } from "./theme";
import { IAudioMetadata } from "music-metadata-browser";
import media from "styled-media-query";

export type Status = "playing" | "paused" | "stopped" | "loaded";

export type Metadata = {
  title: string;
  artist?: string;
  album?: string;
  picture?: Buffer;
};

const Metadata = styled.div`
  font-family: Aileron;
`;

const Img = styled.div`
img {
  min-width: 50px;
  max-width: 100%;
  height: auto;
}
`;

const Title = styled.h5`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 0 5px 0;
  color: ${colors.gray[9]};
`;
const Album = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${props => props.theme.colors.secondary[7]};
`;

const Container = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 4fr 1fr;
  grid-gap: 1rem;
  padding: 2em;
  align-items: center;

  ${Metadata} {
    display: grid;
    grid-gap: 0 1em;
    grid-column: 1/3;
    padding: 1rem 0;

    ${Img} {
      justify-self: center;


    }

    ${Title} {
      align-self: center;
      justify-self: center;

    }
    
    ${Album} {
      align-self: center;
      justify-self: center;
    }
  }

  ${Controls} {
    grid-column: 1/3;
    align-self: end;
  }

  ${SeekBar} {
    align-self: start;
  }

  ${SoundBar} {
    grid-column: 0.5;
  }
`;

type PlayerProps = {
  className?: string;

  metadata?: Metadata;

  duration: number;
  seek: number;

  onPlay?: () => void;
  onStop?: () => void;
  onPause?: () => void;
  onSeek?: (p: number) => void;

  status?: Status;

  volume: number;

  onVolumeChange?: (n: number) => void;

  onStartSeeking?: () => void;
  onStopSeeking?: () => void;
  seeking: boolean;
};
const MusicPlayer: React.FC<PlayerProps> = ({
  className,
  metadata,
  onPause,
  onStop,
  onPlay,
  volume,
  status,
  onVolumeChange,
  onSeek,
  duration = 100,
  seek = 0,
  onStartSeeking,
  onStopSeeking,
  seeking
}) => {
  return (
    <Container className={className}>
      <Metadata>
        {metadata?.picture?.[0] && (
          <Img>
            <img src={URL.createObjectURL(new Blob([metadata.picture]))} />
          </Img>
        )}

        <Title>{metadata?.title}</Title>
        {metadata?.album && <Album>{metadata?.album}</Album>}
      </Metadata>
      <Controls
        onPause={onPause}
        onPlay={onPlay}
        onStop={onStop}
        playing={status === "playing"}
      />
      <SeekBar
        seeking={seeking}
        onStartSeeking={onStartSeeking}
        onStopSeeking={onStopSeeking}
        value={seek}
        onSeek={onSeek}
        max={duration}
        disabled={status === "stopped"}
      />
      <SoundBar
        value={volume}
        onChange={n => {
          if (onVolumeChange) {
            onVolumeChange(n);
          }
        }}
      />
    </Container>
  );
};

const StyledMusicPlayer = styled(MusicPlayer)`
  user-select: none;
  padding: 1em;
`;

export default StyledMusicPlayer;

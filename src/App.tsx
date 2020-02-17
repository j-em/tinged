import { remote } from "electron";
import { readFileSync } from "fs";
import { Howl, Howler } from "howler";
import { basename, extname } from "path";
import { normalize } from "polished";
import "react-hot-loader"
import { hot } from "react-hot-loader"
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react";
import { Helmet } from "react-helmet";

import { FaMusic, FaReact, FaSmile } from "react-icons/fa";
import { animated, useTransition } from "react-spring";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Button from "ui/Button";

import MusicPlayer, { Status } from "./Player";
import theme from "./theme";
import useElectronMenu from "./useElectronMenu";
import useMusicMetadata from "./useMusicMetadata";
import Onboarding from "./Onboarding";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Aileron';
  src: url("./aileron-500.woff) format("woff");
  font-weight: 500;
  font-style: normal;
}
${normalize()}
`;

const App: React.FC = props => {
  const [initialized, setInitialized] = useState(false);
  const [filePath, setFilePath] = useState<string>();
  const [status, setStatus] = useState<Status>();
  const [isSeeking, setSeeking] = useState(false);
  const [volume, setVolume] = useState(20);

  const [duration, setDuration] = useState<number>(0);
  const [seekVal, setSeek] = useState<number>(0);

  const howlRef = useRef<Howl>();

  useEffect(() => {
    if (howlRef.current) {
      Howler.unload();
    }

    if (filePath) {
      const buffer = readFileSync(filePath);
      const blob = new Blob([buffer]);

      const url = URL.createObjectURL(blob);

      const ext = extname(filePath).substring(1);
      const format = ext === "" ? ["mp3", "ogg", "flac"] : [ext];

      howlRef.current = new Howl({
        src: [url],
        format,
        volume: 0.2,
        onload: () => {
          setStatus("loaded");
          setDuration(howlRef.current?.duration() as number);
          setSeek(0);
          howlRef.current?.play();
        },
        onplay: () => {
          setStatus("playing");
          const cb = () => {
            if (howlRef.current?.playing()) {
              setSeek(howlRef.current?.seek() as number);
              window.requestAnimationFrame(cb);
            }
          };

          window.requestAnimationFrame(cb);
        },
        onstop: () => setStatus("stopped"),
        onend: () => {
          setStatus("stopped");
          console.log("STOPPED");
        },
        onpause: () => setStatus("paused"),

        onseek: () => {
          setSeek(howlRef.current?.seek() as number);
        }
      });

      setInitialized(true);
    }
  }, [filePath, setInitialized, setStatus, setDuration, setSeek]);

  const menuTemplate: (
    | Electron.MenuItem
    | Electron.MenuItemConstructorOptions
  )[] = useMemo(() =>
    [
      {
        label: remote.app.name,
        submenu: [
          {
            role: "about"
          },
          {
            type: "separator"
          },
          {
            role: "quit"
          }
        ]
      },
      {
        label: "File",
        submenu: [
          {
            label: "Open file...",
            click: async () => {
              const path = remote.dialog.showOpenDialogSync({
                properties: ["openFile"]
              });
              if (path?.[0]) {
                setFilePath(path[0]);
              }
            }
          }
        ]
      },
      {
        label: "Help",
        submenu: [
          {
            label: "Toggle Developer Tools",
            click: () => remote.getCurrentWebContents().openDevTools()
          }
        ]
      }
    ], [])

  useElectronMenu(menuTemplate);

  const metadata = useMusicMetadata(filePath);

  const transitions = useTransition(initialized, null, {
    from: {
      opacity: 0,
      position: "absolute",
      width: "100%"
    },
    enter: {
      opacity: 1
    },

    leave: {
      opacity: 0
    }
  });

  const play = () => {
    howlRef.current?.play();
  };
  const stop = () => {
    howlRef.current?.stop();
    howlRef.current?.seek(0);
  };
  const pause = () => {
    howlRef.current?.pause();
  };
  const seek = (n: number) => {
    howlRef.current?.seek(n);
  };

  const updateVolume = (n: number) => {
    howlRef.current?.volume(n / 100);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Helmet>
        <title>Tinged </title>
      </Helmet>

      {transitions.map(({ key, item: initialized, props }) =>
        initialized ? (
          <animated.div key={key} style={{display: "flex", flexDirection: "column", justifyContent: "center", ...props}}>
            <MusicPlayer
              seeking={isSeeking}
              onStartSeeking={() => {
                setSeeking(true);
                pause();
              }}
              onStopSeeking={() => {
                setSeeking(false);
                play();
              }}
              onSeek={n => {
                if (n > duration) {
                } else {
                  seek(n);
                }
              }}
              volume={volume}
              status={status}
              metadata={{
                title: metadata?.common.title ?? basename(filePath as string),
                album: metadata?.common.album,
                artist: metadata?.common.artist,
                picture: metadata?.common.picture?.[0].data
              }}
              duration={duration}
              seek={seekVal}
              onPause={pause}
              onPlay={play}
              onStop={stop}
              onVolumeChange={updateVolume}
            />
          </animated.div>
        ) : (
          <animated.div style={{height: "100vh", ...props}} key={key}>
            <Onboarding
              onStarted={() => {
                const filePath = remote.dialog.showOpenDialogSync({
                  properties: ["openFile"]
                });
                if (filePath?.[0]) {
                  setFilePath(filePath[0]);
                }
              }}
            />{" "}
          </animated.div>
        )
      )}
    </ThemeProvider>
  );
};

export default hot(module)(App);

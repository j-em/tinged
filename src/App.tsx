import { remote } from "electron";
import { readFileSync } from "fs";
import { Howl, Howler } from "howler";
import { basename, extname } from "path";
import { normalize } from "polished";
import "react-hot-loader";
import { hot } from "react-hot-loader";
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
import Library from "./Library";

import { useLocalStorage } from "react-use";
import "./App.css";

const GlobalStyle = createGlobalStyle`
${normalize()}
`;

const Container = styled.div`
height: 100vh;
`;

const App: React.FC = props => {
  const [library, setLibrary] = useLocalStorage<ReadonlyArray<string>>(
    "library",
    []
  );

  const [initialized, setInitialized] = useState(false);

  const [isLibraryOpened, setLibraryOpened] = useState(false);

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
          setInitialized(true);
          setStatus("loaded");
          setDuration(howlRef.current?.duration() as number);
          setSeek(0);
          setLibrary(library =>
            library.includes(filePath) ? library : [filePath, ...library]
          );

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
        },
        onpause: () => setStatus("paused"),

        onseek: () => {
          setSeek(howlRef.current?.seek() as number);
        },
        onvolume: () => {
          setVolume((howlRef.current?.volume() as number) * 100);
        }
      });
    }
  }, [
    filePath,
    setInitialized,
    setStatus,
    setDuration,
    setSeek,
    setLibrary,
    setVolume
  ]);

  const menuTemplate: (
    | Electron.MenuItem
    | Electron.MenuItemConstructorOptions
  )[] = useMemo(
    () => [
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
    ],
    []
  );

  useElectronMenu(menuTemplate);

  const metadata = useMusicMetadata(filePath);

  const initTransition = useTransition(initialized, null, {
    from: {
      opacity: 0
    },

    enter: {
      opacity: 1,
      position: "absolute",
      width: "100%",
      height: "100%"

    },

    leave: {
      opacity: 0,

    }
  });

  const playerTransition = useTransition(isLibraryOpened, null, {
    from: { opacity: 0 },

    enter: {
      opacity: 1,
      position: "absolute",
      width: "100%"
    },

    leave: {
      opacity: 0,

    }
  });

  const play = useCallback(() => {
    howlRef.current?.play();
  }, []);

  const stop = useCallback(() => {
    howlRef.current?.stop();
    howlRef.current?.seek(0);
  }, []);

  const pause = useCallback(() => {
    howlRef.current?.pause();
  }, []);

  const seek = useCallback((n: number) => {
    howlRef.current?.seek(n);
  }, []);

  const updateVolume = useCallback((n: number) => {
    howlRef.current?.volume(n / 100);
  }, []);

  const onStartHandler = useCallback(() => {
    const filePath = remote.dialog.showOpenDialogSync({
      properties: ["openFile"]
    });
    if (filePath?.[0]) {
      setFilePath(filePath[0]);
    }
  }, [setFilePath]);

  const onOpenLibrary = useCallback(() => setLibraryOpened(true), [
    setLibraryOpened
  ]);
  const onCloseLibrary = useCallback(() => setLibraryOpened(false), [
    setLibraryOpened
  ]);

  const onDeleteLibrary = useCallback(
    (file: string) => setLibrary(library => library.filter(f => f !== file)),
    [setLibrary]
  );

  return (
    <Container>
      <GlobalStyle />
      <Helmet>
        <title>Tinged</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        {initTransition.map(({ key, item: initialized, props }) =>
          initialized ? (
            <animated.div style={props} key={key}>
              <Library
                files={library}
                onFileClick={setFilePath}
                selected={filePath}
                opened={isLibraryOpened}
                onOpen={onOpenLibrary}
                onClose={onCloseLibrary}
                onDelete={onDeleteLibrary}
              />

              {playerTransition.map(
                ({ item: isLibraryOpened, key: k, props: style }) =>
                  !isLibraryOpened && (
                    <animated.div style={style} key={k}>
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
                          title:
                            metadata?.common.title ??
                            basename(filePath as string),
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
                  )
              )}
            </animated.div>
          ) : (
            <animated.div style={props} key={key}>
              <Onboarding onStarted={onStartHandler} />
            </animated.div>
          )
        )}
      </ThemeProvider>
    </Container>
  );
};

export default hot(module)(App);

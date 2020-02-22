import { existsSync } from "fs";
import { basename } from "path";
import React, { useEffect, useMemo, useState } from "react";
import { FaMusic } from "react-icons/fa";
import { animated, useTransition } from "react-spring";
import { useMeasure, useMedia } from "react-use";
import styled, { ThemeProvider } from "styled-components";
import { Key } from "ts-key-enum";
import useClickOutside from "use-onclickoutside";

import theme from "./theme";

const MusicIcon = styled(FaMusic)`
  color: ${({ theme }) => theme.colors.brand};
  margin-right: 1rem;
`;

type LibraryItemProps = {
  active: boolean;
};

const LibraryItem = styled.div<LibraryItemProps>`
  display: flex;
  align-items: center;
  border: ${({ theme }) => theme.colors.secondary[0]};
  padding: 1.8rem 1.5rem;
  font-family: Aileron;
  color: ${({ theme }) => theme.colors.secondary[9]};
  cursor: pointer;
  white-space: nowrap;

  :last-of-type {
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.secondary[2]}`};
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary[1]};
  }
`;

const SearchBar = styled.input`
  padding: 1rem 1.5rem;
  font-family: Aileron;
  font-size: 1.3rem;
  outline: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: relative;
  min-width: min-content;
  font-size: 1rem;
`;

const Content = styled.div`
  border-left: ${({ theme }) => `1px solid ${theme.colors.secondary[2]}`};
  border-right: ${({ theme }) => `1px solid ${theme.colors.secondary[2]}`};
  font-size: inherit;
`;

type LibraryProps = {
  files: ReadonlyArray<string>;
  onFileClick: (file: string) => void;
  selected?: string;

  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete?: (file: string) => void;
  theme?: any;
};

const Library: React.FC<LibraryProps> = ({
  files,
  selected,
  onFileClick,
  opened,
  onOpen,
  onClose,
  onDelete
}) => {
  useEffect(() => {
    files.filter(f => !existsSync(f)).forEach(f => onDelete?.(f));
  }, [files, onDelete]);

  const [filter, setFilter] = useState<string>();

  const [ref, { height, width }] = useMeasure();

  const filteredFiles = useMemo(() => {
    return filter ? files.filter(f => f.includes(filter)) : files;
  }, [filter, files]);

  const containerRef = React.useRef(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, () => onClose());

  useEffect(() => {
    if (opened) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [opened]);

  const openedTransition = useTransition(opened, null, {
    from: {
      height: 0
    },

    update: {
      height: height
    },

    enter: {
      height: height
    },

    leave: {
      height: 0
    }
  });

  const isDesktop = useMedia("(min-width: 768px)", false);

  return (
    <ThemeProvider theme={theme}>
      <Container ref={containerRef}>
        <SearchBar
          ref={inputRef}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          onClick={() => onOpen()}
          placeholder={"Search your library..."}
          onKeyDown={ev => {
            switch (ev.key) {
              case Key.Escape:
                onClose();
                break;
              default:
                break;
            }
          }}
        />

        {openedTransition.map(
          ({ item: opened, key, props: style }) =>
            opened && (
              <animated.div key={key} style={{ overflow: "hidden", ...style }}>
                <Content ref={ref}>
                  {filteredFiles.map(f => (
                    <LibraryItem
                      key={f}
                      active={f === selected}
                      onClick={ev => {
                        onClose();

                        onFileClick(f);
                      }}
                    >
                      <MusicIcon />
                      {isDesktop ? f : basename(f)}
                    </LibraryItem>
                  ))}
                </Content>
              </animated.div>
            )
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Library;

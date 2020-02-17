import { createReadStream } from "fs";
import { IAudioMetadata, parseNodeStream } from "music-metadata-browser";
import { useEffect, useState } from "react";

const useMusicMetadata: (
  path?: string
) => IAudioMetadata | undefined = path => {
  const [metadata, setMetadata] = useState<IAudioMetadata>();

  useEffect(() => {
    if (path) {
      parseNodeStream(createReadStream(path)).then(setMetadata);
    }
  }, [path]);

  return metadata;
};

export default useMusicMetadata;

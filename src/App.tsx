/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import * as React from "react";

interface VideoDimensions {
  width: number;
  height: number;
}

function App() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoDimensions, setVideoDimensions] = React.useState<VideoDimensions>(
    {
      height: 0,
      width: 0,
    }
  );

  const handleLoadedMetadata = React.useCallback(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;

    if (video && wrapper) {
      const {
        offsetWidth: wrapperWidth,
        offsetHeight: wrapperHeight,
      } = wrapper;
      const { videoWidth, videoHeight } = video;

      const wrapperRatio = wrapperWidth / wrapperHeight;
      const videoRatio = videoWidth / videoHeight;

      if (videoRatio >= wrapperRatio) {
        const newWidth = wrapperWidth;
        const newHeight = newWidth / videoRatio;
        setVideoDimensions({ width: newWidth, height: newHeight });
      } else {
        const newHeight = wrapperHeight;
        const newWidth = newHeight * videoRatio;
        setVideoDimensions({ width: newWidth, height: newHeight });
      }
    }
  }, []);

  React.useEffect(() => {
    videoRef.current?.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      videoRef.current?.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    };
  }, [handleLoadedMetadata]);

  React.useEffect(() => {
    window.addEventListener("resize", handleLoadedMetadata);

    return () => {
      window.removeEventListener("resize", handleLoadedMetadata);
    };
  }, [handleLoadedMetadata]);

  const showOverLay = videoDimensions.height && videoDimensions.width;

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        ref={wrapperRef}
        css={css`
          width: 1000px;
          height: 450px;
          position: relative;
        `}
      >
        {showOverLay ? (
          <div
            css={css`
              position: absolute;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <div
              css={css`
                border: solid 2px red;
                width: ${videoDimensions.width}px;
                height: ${videoDimensions.height}px;
              `}
            />
          </div>
        ) : null}
        <video
          ref={videoRef}
          css={css`
            width: 100%;
            height: 100%;
            outline: none;
          `}
          controls
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        />
      </div>
    </div>
  );
}

export default App;

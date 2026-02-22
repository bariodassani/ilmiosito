import { Composition, staticFile } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import { MyComposition } from "./Composition";

const fps = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={fps}
        width={1280}
        height={720}
        calculateMetadata={async () => {
          const data = await getVideoMetadata(staticFile("video.mov"));
          return {
            durationInFrames: Math.ceil(data.durationInSeconds * fps),
            fps,
            width: data.width,
            height: data.height,
          };
        }}
      />
    </>
  );
};

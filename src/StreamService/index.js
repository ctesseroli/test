import { entries } from "lodash";
import {
  handleFairplaySource,
  handlePlayreadySource,
  handleWidevineSource
} from "./drm";

const STREAM_STATE = {
  NOT_SUPPORTED: "NOT_SUPPORTED",
  IN_PROCESS: "IN_PROCESS",
  NOT_USED: "NOT_USED"
};

export const StreamProtocol = {
  HLS: "HLS",
  DASH: "DASH",
  MSS: "MSS",
  MP4: "MP4"
};
export const DRM_TYPE = {
  FAIRPLAY: "fairplay",
  WIDEVINE: "widevine",
  PLAYREADY: "playready"
};

export const VIDEO_EXTENSION = {
  [StreamProtocol.HLS]: "application/x-mpegURL",
  [StreamProtocol.MP4]: "video/mp4",
  [StreamProtocol.DASH]: "application/dash+xml",
  [StreamProtocol.MSS]: "application/dash+xml"
};

export const PRIORITY_BY_PROTOCOL = [
  `${StreamProtocol.DASH}:${DRM_TYPE.WIDEVINE}`,
  `${StreamProtocol.HLS}:${DRM_TYPE.FAIRPLAY}`,
  `${StreamProtocol.DASH}:${DRM_TYPE.PLAYREADY}`,
  `${StreamProtocol.MSS}:${DRM_TYPE.PLAYREADY}`,
  StreamProtocol.HLS,
  StreamProtocol.DASH,
  StreamProtocol.MSS,
  StreamProtocol.MP4
];

export const isEncryptedStream = (s) => {
  return s.drm_type && s.ls_url;
};

const keySystemsExtension = (drm_type) => {
  const DataMap = {
    [DRM_TYPE.WIDEVINE]: () => ({
      keySystems: handleWidevineSource(
        "https://origin-preprod.more.tv/widevine"
      )
    }),
    [DRM_TYPE.FAIRPLAY]: () => ({
      keySystems: handleFairplaySource(
        "https://origin-preprod.more.tv/fairplay"
      )
    })
    // [DRM_TYPE.PLAYREADY]: () => ({
    //   keySystems: handlePlayreadySource(ls_url)
    // })
  };

  return DataMap[drm_type]?.();
};

export const createSource = (stream, protocol, drm) => {
  const ext = drm ? keySystemsExtension(drm) : {};

  return {
    src: stream,
    type: VIDEO_EXTENSION[protocol],
    ...ext
  };
};

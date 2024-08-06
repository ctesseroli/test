import "videojs-contrib-eme";
import videojs from "video.js";

import React from "react";
import { createSource, StreamProtocol, DRM_TYPE } from "./StreamService";
import "./styles.css";

const DEFAULT_PLAYER_ID = "player_id";

const VIDEO_EXTENSION = {
  HLS: "application/x-mpegURL",
  MP4: "video/mp4",
  DASH: "application/dash+xml",
  MSS: "application/dash+xml"
};

const typeParser = (src) => {
  if (src.includes("master.m3u8")) return VIDEO_EXTENSION.HLS;

  if (src.includes("manifest.mpd")) return VIDEO_EXTENSION.DASH;

  if (src.includes(".ism/manifest")) return VIDEO_EXTENSION.MSS;

  return null;
};

// const createSource = (src) => {
//   return {
//     src,
//     type: typeParser(src)
//   };
// };

const SOURCES = [
  {
    key: "multiurl-1",
    dash:
      "https://origin-preprod.more.tv/debug/dash/fta/01024f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,.urlset/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug/hls/fta/01024f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,.urlset/master.m3u8"
  },
  {
    key: "map-resp-1",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/fta/01024f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fta/01024f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "multiurl-2",
    dash:
      "https://origin-preprod.more.tv/debug/dash/fta/01034f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,rus.srt/lang/rus,.urlset/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug/hls/fta/01034f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,rus.srt/lang/rus,.urlset/master.m3u8"
  },
  {
    key: "map-resp-2",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/fta/01034f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fta/01034f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "multiurl-3",
    dash:
      "https://origin-preprod.more.tv/debug/dash/fta/01054f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,rus.srt/lang/rus,.urlset/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug/hls/fta/01054f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,rus.srt/lang/rus,.urlset/master.m3u8"
  },
  {
    key: "map-resp-3",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/fta/01054f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fta/01054f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "multiurl-4",
    dash:
      "https://origin-preprod.more.tv/debug/dash/fta/01084f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,eng.mp4,eng.srt,rus.srt/lang/rus/lang/eng,.urlset/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug/hls/fta/01084f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,eng.mp4,eng.srt,rus.srt/lang/rus/lang/eng,.urlset/master.m3u8"
  },
  {
    key: "map-resp-4",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/fta/01084f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fta/01084f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "multiurl-5",
    dash:
      "https://origin-preprod.more.tv/debug/dash/fta/01074f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,rus.srt/lang/rus,eng.srt/lang/eng,spa.srt/lang/spa,.urlset/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug/hls/fta/01074f17eb8557d464a8ad15ed17d4b5-,hd10.mp4,hd20.mp4,hd40.mp4,rus.srt/lang/rus,eng.srt/lang/eng,spa.srt/lang/spa,.urlset/master.m3u8"
  },
  {
    key: "map-resp-5",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/fta/01074f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fta/01074f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  }
];

const SOURCES_DRM = [
  {
    key: "map-resp-1-drm",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/wv/01024f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fp/01024f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "map-resp-2-drm",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/wv/01034f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fp/01034f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "map-resp-3-drm",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/wv/01054f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fp/01054f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "map-resp-4-drm",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/wv/01084f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fp/01084f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  },
  {
    key: "map-resp-5-drm",
    dash:
      "https://origin-preprod.more.tv/debug2/dash/wv/01074f17eb8557d464a8ad15ed17d4b5/manifest.mpd",
    hls:
      "https://origin-preprod.more.tv/debug2/hls/fp/01074f17eb8557d464a8ad15ed17d4b5/master.m3u8"
  }
];

export default function App() {
  const player = React.useRef(null);
  const [videoNode, setVideoNode] = React.useState(false);
  const [error, setError] = React.useState("");
  const [currentItem, setCurrentItem] = React.useState(null);

  const [audioTracks, setAudioTracks] = React.useState([]);

  const setVideoRef = React.useCallback((node) => {
    setVideoNode(node);
  }, []);

  React.useEffect(() => {
    const playerInstance = videojs(DEFAULT_PLAYER_ID, {
      enableSourceset: true,
      preload: "metadata",
      controls: true
    });

    window.api = playerInstance;

    playerInstance.eme();

    playerInstance.on("play", () => {
      console.log("play");

      console.log("[AudioTracks]", player.current?.audioTracks());
      console.log("[TextTracks]", player.current?.textTracks());
      console.log("[Tech]", player.current?.tech()?.vhs?.playlists.master);
    });

    playerInstance.on("sourceset", (data) => {});
    playerInstance.on("timeupdate", (data) => {
      // console.log({
      //   d: playerInstance.duration(),
      //   t: playerInstance.currentTime()
      // });
    });

    player.current = playerInstance;
    playerInstance.ready(() => {
      // playerInstance.play();
    });

    return () => {
      if (player.current) player.current.dispose();
    };
  }, []);

  const onLoad = async (source, protocol, drm) => {
    if (!player.current) return;

    // const response = await window.fetch(source);
    // const txt = await response.text();
    const obj = createSource(source, protocol, drm);

    console.log("[ONLOAD]: ", source, obj);

    player.current.src({
      ...obj,
      src:
        "data:application/x-mpegURL;base64,I0VYVE0zVQoKI0VYVC1YLU1FRElBOlRZUEU9QVVESU8sR1JPVVAtSUQ9ImF1ZGlvMCIsTkFNRT0iUnUiLExBTkdVQUdFPSJydSIsQVVUT1NFTEVDVD1ZRVMsREVGQVVMVD1ZRVMsQ0hBTk5FTFM9IjIiLFVSST0iaW5kZXgtZjEtYTEubTN1OCIKI0VYVC1YLU1FRElBOlRZUEU9QVVESU8sR1JPVVAtSUQ9ImF1ZGlvMCIsTkFNRT0iRW5nbGlzaCIsTEFOR1VBR0U9ImVuIixBVVRPU0VMRUNUPU5PLERFRkFVTFQ9Tk8sQ0hBTk5FTFM9IjIiLFVSST0iaW5kZXgtZjEtYTIubTN1OCIKCiNFWFQtWC1TVFJFQU0tSU5GOlBST0dSQU0tSUQ9MSxCQU5EV0lEVEg9NzkzODg5LFJFU09MVVRJT049NjQweDM2MCxGUkFNRS1SQVRFPTI1LjAwMCxDT0RFQ1M9ImF2YzEuNGQ0MDIwLG1wNGEuNDAuMiIsQVVESU89ImF1ZGlvMCIKaHR0cHM6Ly9tZi1zc2wtMDEubW9yZS50di92b2QvaGxzL2Z0YS9jeHpKdC1ZUzZaOGIySmM5Nld4RnpBL2ViZTQxZDM1NzBiN2E5NDkxYWNlYmI2MDgzMGU5NjgxLSxoZDEwLGhkMjAsaGQzMCxoZDQwLC5tcDQudXJsc2V0L2luZGV4LWYxLXYxLWExLm0zdTgKI0VYVC1YLVNUUkVBTS1JTkY6UFJPR1JBTS1JRD0xLEJBTkRXSURUSD0xNDkxMTc1LFJFU09MVVRJT049OTYweDU0MCxGUkFNRS1SQVRFPTI1LjAwMCxDT0RFQ1M9ImF2YzEuNGQ0MDIwLG1wNGEuNDAuMiIsQVVESU89ImF1ZGlvMCIKaHR0cHM6Ly9tZi1zc2wtMDEubW9yZS50di92b2QvaGxzL2Z0YS9jeHpKdC1ZUzZaOGIySmM5Nld4RnpBL2ViZTQxZDM1NzBiN2E5NDkxYWNlYmI2MDgzMGU5NjgxLSxoZDEwLGhkMjAsaGQzMCxoZDQwLC5tcDQudXJsc2V0L2luZGV4LWYyLXYxLWExLm0zdTgKI0VYVC1YLVNUUkVBTS1JTkY6UFJPR1JBTS1JRD0xLEJBTkRXSURUSD0zMDgyNTQ1LFJFU09MVVRJT049MTI4MHg3MjAsRlJBTUUtUkFURT0yNS4wMDAsQ09ERUNTPSJhdmMxLjY0MDAyOSxtcDRhLjQwLjIiLEFVRElPPSJhdWRpbzAiCmh0dHBzOi8vbWYtc3NsLTAxLm1vcmUudHYvdm9kL2hscy9mdGEvY3h6SnQtWVM2WjhiMkpjOTZXeEZ6QS9lYmU0MWQzNTcwYjdhOTQ5MWFjZWJiNjA4MzBlOTY4MS0saGQxMCxoZDIwLGhkMzAsaGQ0MCwubXA0LnVybHNldC9pbmRleC1mMy12MS1hMS5tM3U4CiNFWFQtWC1TVFJFQU0tSU5GOlBST0dSQU0tSUQ9MSxCQU5EV0lEVEg9NTA3Njc4MSxSRVNPTFVUSU9OPTE5MjB4MTA4MCxGUkFNRS1SQVRFPTI1LjAwMCxDT0RFQ1M9ImF2YzEuNjQwMDMyLG1wNGEuNDAuMiIsQVVESU89ImF1ZGlvMCIKaHR0cHM6Ly9tZi1zc2wtMDEubW9yZS50di92b2QvaGxzL2Z0YS9jeHpKdC1ZUzZaOGIySmM5Nld4RnpBL2ViZTQxZDM1NzBiN2E5NDkxYWNlYmI2MDgzMGU5NjgxLSxoZDEwLGhkMjAsaGQzMCxoZDQwLC5tcDQudXJsc2V0L2luZGV4LWY0LXYxLWExLm0zdTg="
    });

    console.log({
      ...obj,
      src:
        "data:application/x-mpegURL;base64,I0VYVE0zVQoKI0VYVC1YLU1FRElBOlRZUEU9QVVESU8sR1JPVVAtSUQ9ImF1ZGlvMCIsTkFNRT0iUnUiLExBTkdVQUdFPSJydSIsQVVUT1NFTEVDVD1ZRVMsREVGQVVMVD1ZRVMsQ0hBTk5FTFM9IjIiLFVSST0iaW5kZXgtZjEtYTEubTN1OCIKI0VYVC1YLU1FRElBOlRZUEU9QVVESU8sR1JPVVAtSUQ9ImF1ZGlvMCIsTkFNRT0iRW5nbGlzaCIsTEFOR1VBR0U9ImVuIixBVVRPU0VMRUNUPU5PLERFRkFVTFQ9Tk8sQ0hBTk5FTFM9IjIiLFVSST0iaW5kZXgtZjEtYTIubTN1OCIKCiNFWFQtWC1TVFJFQU0tSU5GOlBST0dSQU0tSUQ9MSxCQU5EV0lEVEg9NzkzODg5LFJFU09MVVRJT049NjQweDM2MCxGUkFNRS1SQVRFPTI1LjAwMCxDT0RFQ1M9ImF2YzEuNGQ0MDIwLG1wNGEuNDAuMiIsQVVESU89ImF1ZGlvMCIKaHR0cHM6Ly9tZi1zc2wtMDEubW9yZS50di92b2QvaGxzL2Z0YS9jeHpKdC1ZUzZaOGIySmM5Nld4RnpBL2ViZTQxZDM1NzBiN2E5NDkxYWNlYmI2MDgzMGU5NjgxLSxoZDEwLGhkMjAsaGQzMCxoZDQwLC5tcDQudXJsc2V0L2luZGV4LWYxLXYxLWExLm0zdTgKI0VYVC1YLVNUUkVBTS1JTkY6UFJPR1JBTS1JRD0xLEJBTkRXSURUSD0xNDkxMTc1LFJFU09MVVRJT049OTYweDU0MCxGUkFNRS1SQVRFPTI1LjAwMCxDT0RFQ1M9ImF2YzEuNGQ0MDIwLG1wNGEuNDAuMiIsQVVESU89ImF1ZGlvMCIKaHR0cHM6Ly9tZi1zc2wtMDEubW9yZS50di92b2QvaGxzL2Z0YS9jeHpKdC1ZUzZaOGIySmM5Nld4RnpBL2ViZTQxZDM1NzBiN2E5NDkxYWNlYmI2MDgzMGU5NjgxLSxoZDEwLGhkMjAsaGQzMCxoZDQwLC5tcDQudXJsc2V0L2luZGV4LWYyLXYxLWExLm0zdTgKI0VYVC1YLVNUUkVBTS1JTkY6UFJPR1JBTS1JRD0xLEJBTkRXSURUSD0zMDgyNTQ1LFJFU09MVVRJT049MTI4MHg3MjAsRlJBTUUtUkFURT0yNS4wMDAsQ09ERUNTPSJhdmMxLjY0MDAyOSxtcDRhLjQwLjIiLEFVRElPPSJhdWRpbzAiCmh0dHBzOi8vbWYtc3NsLTAxLm1vcmUudHYvdm9kL2hscy9mdGEvY3h6SnQtWVM2WjhiMkpjOTZXeEZ6QS9lYmU0MWQzNTcwYjdhOTQ5MWFjZWJiNjA4MzBlOTY4MS0saGQxMCxoZDIwLGhkMzAsaGQ0MCwubXA0LnVybHNldC9pbmRleC1mMy12MS1hMS5tM3U4CiNFWFQtWC1TVFJFQU0tSU5GOlBST0dSQU0tSUQ9MSxCQU5EV0lEVEg9NTA3Njc4MSxSRVNPTFVUSU9OPTE5MjB4MTA4MCxGUkFNRS1SQVRFPTI1LjAwMCxDT0RFQ1M9ImF2YzEuNjQwMDMyLG1wNGEuNDAuMiIsQVVESU89ImF1ZGlvMCIKaHR0cHM6Ly9tZi1zc2wtMDEubW9yZS50di92b2QvaGxzL2Z0YS9jeHpKdC1ZUzZaOGIySmM5Nld4RnpBL2ViZTQxZDM1NzBiN2E5NDkxYWNlYmI2MDgzMGU5NjgxLSxoZDEwLGhkMjAsaGQzMCxoZDQwLC5tcDQudXJsc2V0L2luZGV4LWY0LXYxLWExLm0zdTg="
    });
    player.current.ready(() => {
      player.current.one("loadedmetadata", async () => {
        player.current.play();
      });
    });

    // player.current.src({
    //   type,
    //   src: source, //`data:${type};base64,${btoa(txt)}`
    //   handleManifestRedirects: true
    // });
  };

  return (
    <div className="App">
      <div className="wrapper">
        <video
          className="video-js vjs-default-skin"
          controls
          ref={setVideoRef}
          id={DEFAULT_PLAYER_ID}
          muted
          playsInline
          onError={(e) => console.log(e)}
        />
      </div>
      <div className="currentSource">
        current: {currentItem?.key || "none"}
        <br />
        source: {currentItem?.src || "none"}
      </div>
      <div>
        {SOURCES.map((item, i) => (
          <div className="source" key={item.key}>
            <span>{item.key}</span>
            <button
              className="btn"
              onClick={() => {
                setCurrentItem({ key: item.key, src: item.hls });
                onLoad(item.hls, StreamProtocol.HLS);
              }}
            >
              HLS
            </button>
            <button
              className="btn"
              onClick={() => {
                setCurrentItem({ key: item.key, src: item.dash });
                onLoad(item.dash, StreamProtocol.DASH);
              }}
            >
              DASH
            </button>
          </div>
        ))}
      </div>
      <div className="sources">
        {SOURCES_DRM.map((item, i) => (
          <div className="source" key={item.key}>
            <span>{item.key}</span>
            <button
              className="btn"
              onClick={() => {
                setCurrentItem({ key: item.key, src: item.hls });
                onLoad(item.hls, StreamProtocol.HLS, DRM_TYPE.FAIRPLAY);
              }}
            >
              HLS
            </button>
            <button
              className="btn"
              onClick={() => {
                setCurrentItem({ key: item.key, src: item.dash });
                onLoad(item.dash, StreamProtocol.DASH, DRM_TYPE.WIDEVINE);
              }}
            >
              DASH
            </button>
          </div>
        ))}
      </div>
      <span className="error">{error}</span>
    </div>
  );
}

// ios 15.1 не работает повторный выбор дорожек
// если текстовых дорожек нет, отображается unknown

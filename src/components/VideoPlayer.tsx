"use client";

import "plyr/dist/plyr.css";

import { useEffect, useMemo, useRef, useState } from "react";
import Plyr from "plyr";
import { Download, Film, ShieldAlert } from "lucide-react";

import type { VideoRecord } from "@/lib/media.types";

export function VideoPlayer({
  video,
  onProgress,
}: {
  video: VideoRecord;
  onProgress?: (progress: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);
  const onProgressRef = useRef(onProgress);
  const [quality, setQuality] = useState(0);
  const [playbackError, setPlaybackError] = useState(false);
  const sources = useMemo(() => video.sources?.length ? video.sources : [
    { label: "Default", url: video.videoUrl, mimeType: "video/mp4", provider: video.storageProvider },
  ], [video]);
  const selectedSource = sources[quality] ?? sources[0];

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    setQuality(0);
  }, [video.id]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    // Plyr is initialised after the source element is mounted so the controls
    // can attach to the correct DOM node for the current rendition.
    const player = new Plyr(element, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["speed", "quality"],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      clickToPlay: true,
      keyboard: { focused: true, global: true },
      tooltips: { controls: true, seek: true },
    });

    playerRef.current = player;
    setPlaybackError(false);

    const handleTimeUpdate = () => {
      if (!element.duration || !onProgressRef.current) return;
      onProgressRef.current(Math.round((element.currentTime / element.duration) * 100));
    };
    element.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      element.removeEventListener("timeupdate", handleTimeUpdate);
      player.destroy();
      playerRef.current = null;
    };
  }, [selectedSource.url]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/70 shadow-[0_24px_80px_-30px_rgba(255,107,0,0.45)]">
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-primary">
            <Film className="h-3.5 w-3.5" />
            Secure player
          </div>
          <h3 className="mt-3 font-display text-xl font-semibold">{video.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{video.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Quality
            <select
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="ml-3 bg-transparent text-foreground outline-none"
            >
              {sources.map((source, index) => (
                <option key={source.url} value={index}>
                  {source.label}
                </option>
              ))}
            </select>
          </label>

          <a
            href={selectedSource.url}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </div>

      <div className="relative bg-black">
        {playbackError ? (
          <div className="grid min-h-[320px] place-items-center px-6 py-16 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h4 className="mt-4 font-display text-xl font-semibold">Asset pending upload</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                The metadata record exists, but the local video file has not been uploaded yet.
                Use the dashboard to replace the placeholder asset with a real MP4 or WebM file.
              </p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            key={selectedSource.url}
            controls
            playsInline
            preload="metadata"
            poster={video.thumbnail}
            onError={() => setPlaybackError(true)}
            className="aspect-video w-full"
          >
            <source src={selectedSource.url} type={selectedSource.mimeType} />
            {video.subtitleUrl && <track kind="subtitles" srcLang="en" src={video.subtitleUrl} label="English" default />}
          </video>
        )}
      </div>
    </div>
  );
}

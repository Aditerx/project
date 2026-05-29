import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Clock3,
  Layers3,
  Tags,
  PlayCircle,
  FolderOpen,
  Film,
  Download,
} from "lucide-react";

import { BRAND_NAME } from "@/lib/brand";
import { fetchJson } from "@/lib/http";
import type { VideoRecord } from "@/lib/media.types";
import { InternalHeader } from "@/components/internal/InternalHeader";
import { SecureGate } from "@/components/internal/SecureGate";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useAuthSession } from "@/hooks/use-auth-session";

type MediaResponse = {
  ok: true;
  videos: VideoRecord[];
  stats: {
    totalVideos: number;
    featuredVideos: number;
    categories: number;
    tags: number;
    localProvider: "local";
  };
};

const CONTINUE_WATCHING_KEY = "ip-protection-progress";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: `Vault | ${BRAND_NAME}` },
      {
        name: "description",
        content: "Secure internal media vault for IP Protection viewer and admin workflows.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: VaultPage,
});

function VaultPage() {
  return (
    <SecureGate>
      <VaultContent />
    </SecureGate>
  );
}

function VaultContent() {
  const { session } = useAuthSession();
  const [payload, setPayload] = useState<MediaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    // Continue-watching state is intentionally stored in sessionStorage so it
    // disappears with the browser tab, matching the session model used for
    // authentication.
    try {
      const raw = window.sessionStorage.getItem(CONTINUE_WATCHING_KEY);
      if (raw) setProgressMap(JSON.parse(raw) as Record<string, number>);
    } catch {
      // We silently ignore malformed progress data and rebuild it from scratch.
    }
  }, []);

  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true);
      try {
        const response = await fetchJson<MediaResponse>("/api/media");
        setPayload(response);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMedia();
  }, []);

  const videos = payload?.videos ?? [];

  useEffect(() => {
    if (selectedId || videos.length === 0) return;
    setSelectedId(videos.find((video) => video.featured)?.id ?? videos[0].id);
  }, [selectedId, videos]);

  const categories = useMemo(() => ["All", ...new Set(videos.map((video) => video.category))], [videos]);
  const tags = useMemo(() => ["All", ...new Set(videos.flatMap((video) => video.tags))], [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        search.trim().length === 0 ||
        [video.title, video.description, video.category, ...video.tags]
          .join(" ")
          .toLowerCase()
          .includes(search.trim().toLowerCase());
      const matchesCategory = activeCategory === "All" || video.category === activeCategory;
      const matchesTag = activeTag === "All" || video.tags.includes(activeTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [activeCategory, activeTag, search, videos]);

  const selectedVideo =
    filteredVideos.find((video) => video.id === selectedId) ?? filteredVideos[0] ?? videos[0] ?? null;

  const featured = filteredVideos.filter((video) => video.featured).slice(0, 3);
  const recent = [...filteredVideos].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 6);
  const continueWatching = Object.entries(progressMap)
    .map(([id, progress]) => ({ id, progress, video: videos.find((item) => item.id === id) }))
    .filter((entry) => entry.video && entry.progress > 0)
    .sort((left, right) => right.progress - left.progress);

  const handleProgress = (id: string, progress: number) => {
    setProgressMap((current) => {
      const next = { ...current, [id]: progress };
      window.sessionStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute -top-24 right-0 h-[420px] w-[640px] rounded-full bg-primary/10 blur-[120px]" />
      <InternalHeader />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-border bg-card/70 p-6 shadow-[0_22px_90px_-40px_rgba(255,107,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-primary">
                <Film className="h-3.5 w-3.5" />
                Secure internal media vault
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Confidential media distribution for enterprise teams.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Browse, search, and review protected media assets with enterprise-grade
                controls. Every asset stays local today and can move to a signed cloud
                provider later without changing the UI contract.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              {[
                { value: payload?.stats.totalVideos ?? 0, label: "Assets" },
                { value: payload?.stats.featuredVideos ?? 0, label: "Featured" },
                { value: payload?.stats.categories ?? 0, label: "Categories" },
                { value: payload?.stats.tags ?? 0, label: "Tags" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl border border-border p-4">
                  <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="mt-8 grid gap-8 lg:grid-cols-12">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-3xl border border-border p-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                <Search className="h-3.5 w-3.5 text-primary" />
                Search
              </div>
              <div className="mt-3 rounded-2xl border border-border bg-background/80 px-4 py-3">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Title, category, tag..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  <Layers3 className="h-3.5 w-3.5 text-primary" />
                  Categories
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeCategory === category
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  <Tags className="h-3.5 w-3.5 text-primary" />
                  Tags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(tag)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeTag === tag
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Session
                </div>
                <div className="mt-3 text-sm font-medium">{session?.username}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Role: <span className="font-mono uppercase tracking-wider text-primary">{session?.role}</span>
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="lg:col-span-9">
            {selectedVideo ? (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <VideoPlayer
                    video={selectedVideo}
                    onProgress={(progress) => handleProgress(selectedVideo.id, progress)}
                  />
                </motion.div>

                <div className="grid gap-6 xl:grid-cols-3">
                  <section className="xl:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {featured.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => setSelectedId(video.id)}
                          className={`group rounded-2xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50 ${
                            selectedVideo.id === video.id ? "border-primary/50 shadow-[0_10px_40px_-18px_rgba(255,107,0,0.5)]" : "border-border"
                          }`}
                        >
                          <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/75">
                              <PlayCircle className="h-3 w-3 text-primary" />
                              Featured
                            </div>
                          </div>
                          <h3 className="mt-4 font-display text-lg font-semibold">{video.title}</h3>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                            Recently added
                          </div>
                          <h2 className="mt-1 font-display text-2xl font-bold">Library</h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          <Download className="h-3.5 w-3.5 text-primary" />
                          Download available for each asset
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {recent.map((video) => (
                          <button
                            key={video.id}
                            type="button"
                            onClick={() => setSelectedId(video.id)}
                            className={`group flex gap-4 rounded-2xl border bg-card p-4 text-left transition hover:border-primary/50 ${
                              selectedVideo.id === video.id ? "border-primary/50" : "border-border"
                            }`}
                          >
                            <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-border">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="font-display text-base font-semibold">{video.title}</h3>
                                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                  {video.category}
                                </span>
                              </div>
                              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {video.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-border bg-background/70 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>

                  <aside className="space-y-4">
                    <div className="glass-card rounded-2xl border border-border p-4">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5 text-primary" />
                        Continue watching
                      </div>
                      <div className="mt-4 space-y-3">
                        {continueWatching.length === 0 && (
                          <div className="rounded-xl border border-dashed border-border bg-background/50 p-4 text-sm text-muted-foreground">
                            Your playback progress will appear here after you start watching an
                            asset in this tab.
                          </div>
                        )}
                        {continueWatching.slice(0, 4).map((entry) => (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => setSelectedId(entry.id)}
                            className="w-full rounded-xl border border-border bg-background/70 p-3 text-left transition hover:border-primary/40"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate font-medium">{entry.video?.title}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {entry.progress}% watched
                                </div>
                              </div>
                              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
                                Resume
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl border border-border p-4">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        <FolderOpen className="h-3.5 w-3.5 text-primary" />
                        Asset notes
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <p>Local provider is active for all current assets.</p>
                        <p>Video download uses the direct storage URL so future cloud providers can swap in signed links without UI rewrites.</p>
                        <p>Admin uploads populate the metadata file at `storage/metadata/videos.json`.</p>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[60vh] place-items-center rounded-3xl border border-border bg-card/60 p-10 text-center">
                <div className="max-w-md">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <Film className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold">
                    {isLoading ? "Loading vault..." : "No media found"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isLoading
                      ? "We are loading the secure asset catalog."
                      : "Upload the first video and thumbnail pair in the dashboard to activate the vault."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


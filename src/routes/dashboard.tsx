import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  FolderPlus,
  PencilLine,
  PlusCircle,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { BRAND_NAME } from "@/lib/brand";
import { fetchJson } from "@/lib/http";
import type { VideoRecord } from "@/lib/media.types";
import { InternalHeader } from "@/components/internal/InternalHeader";
import { SecureGate } from "@/components/internal/SecureGate";
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

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: `Dashboard | ${BRAND_NAME}` },
      {
        name: "description",
        content: "Administrative media management console for IP Protection internal assets.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <SecureGate role="admin">
      <DashboardContent />
    </SecureGate>
  );
}

function DashboardContent() {
  const { session } = useAuthSession();
  const [payload, setPayload] = useState<MediaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | "new">("new");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reload = async () => {
    setIsLoading(true);
    try {
      const response = await fetchJson<MediaResponse>("/api/media");
      setPayload(response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const videos = payload?.videos ?? [];
  const selectedVideo = selectedId === "new" ? null : videos.find((video) => video.id === selectedId) ?? null;
  const categories = useMemo(() => [...new Set(videos.map((video) => video.category))], [videos]);

  const handleDelete = async (video: VideoRecord) => {
    if (!window.confirm(`Delete ${video.title}? This will remove the local asset and metadata.`)) {
      return;
    }

    setErrorMessage(null);
    try {
      await fetchJson<{ ok: true }>(`/api/media/${video.id}`, { method: "DELETE" });
      setStatusMessage(`Deleted ${video.title}.`);
      if (selectedId === video.id) setSelectedId("new");
      await reload();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete asset.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
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
                <FolderPlus className="h-3.5 w-3.5" />
                Asset management console
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Manage the internal media distribution pipeline.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Create, update, replace, and delete catalog entries without leaving the secure
                environment. Local storage is the first provider; cloud providers can plug in
                later through the same abstraction.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              {[
                { value: payload?.stats.totalVideos ?? 0, label: "Total assets" },
                { value: payload?.stats.featuredVideos ?? 0, label: "Featured" },
                { value: categories.length, label: "Categories" },
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

          {(statusMessage || errorMessage) && (
            <div className="mt-6 grid gap-3">
              {statusMessage && (
                <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                  {statusMessage}
                </div>
              )}
              {errorMessage && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}
            </div>
          )}
        </motion.section>

        <section className="mt-8 grid gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <AssetEditor
            key={selectedVideo?.id ?? "new"}
            sessionUser={session?.username ?? "admin"}
            selectedVideo={selectedVideo}
            isLoading={isLoading}
            onSaved={async (message) => {
              setStatusMessage(message);
              setErrorMessage(null);
              await reload();
              setSelectedId("new");
            }}
            onError={(message) => {
              setStatusMessage(null);
              setErrorMessage(message);
            }}
          />
          </motion.div>

          <div className="lg:col-span-8">
            <div className="glass-card rounded-3xl border border-border p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    Asset inventory
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold">Current records</h2>
                </div>
                <button
                  type="button"
                  onClick={() => reload()}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-4 py-2 text-sm font-medium transition hover:border-primary/50 hover:text-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-left">
                  <thead className="bg-background/60 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Provider</th>
                      <th className="px-4 py-3">Updated</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card/60">
                    {videos.map((video) => (
                      <tr key={video.id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="font-medium text-foreground">{video.title}</div>
                          <div className="mt-1 max-w-md text-sm text-muted-foreground">
                            {video.description}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {video.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border bg-background/70 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{video.category}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {video.storageProvider}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {new Date(video.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedId(video.id)}
                              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm transition hover:border-primary/50 hover:text-primary"
                            >
                              <PencilLine className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(video)}
                              className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive transition hover:border-destructive/60 hover:bg-destructive/15"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && videos.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          No assets are available yet. Use the create form to upload the first
                          internal video.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-primary" />
                Admin changes write directly to `storage/metadata/videos.json` and the local asset folders.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function AssetEditor({
  selectedVideo,
  isLoading,
  sessionUser,
  onSaved,
  onError,
}: {
  selectedVideo: VideoRecord | null;
  isLoading: boolean;
  sessionUser: string;
  onSaved: (message: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mode = selectedVideo ? "update" : "create";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData(formRef.current);
      formData.set("featured", formData.get("featured") === "on" ? "true" : "false");

      const endpoint = selectedVideo ? `/api/media/${selectedVideo.id}` : "/api/media";
      const method = selectedVideo ? "PUT" : "POST";
      const response = await fetchJson<{ ok: true; video: VideoRecord }>(endpoint, {
        method,
        body: formData,
      });

      await onSaved(
        `${selectedVideo ? "Updated" : "Created"} ${response.video.title} successfully.`,
      );
      formRef.current.reset();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Unable to save asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-border p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Asset editor
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold">
            {selectedVideo ? "Edit record" : "Create asset"}
          </h2>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
          {mode}
        </span>
      </div>

      <form ref={formRef} onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Title
          </label>
          <input
            name="title"
            defaultValue={selectedVideo?.title ?? ""}
            required
            className="mt-2 w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Internal Briefing"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={selectedVideo?.description ?? ""}
            required
            rows={4}
            className="mt-2 w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Confidential asset for internal stakeholders."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Category
            </label>
            <input
              name="category"
              defaultValue={selectedVideo?.category ?? ""}
              required
              className="mt-2 w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Research"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Tags
            </label>
            <input
              name="tags"
              defaultValue={selectedVideo?.tags.join(", ") ?? ""}
              className="mt-2 w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="internal, secure, research"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Video file
            </label>
            <input
              name="videoFile"
              type="file"
              accept=".mp4,.webm,video/mp4,video/webm"
              className="mt-2 w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground file:font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Thumbnail
            </label>
            <input
              name="thumbnailFile"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
              className="mt-2 w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground file:font-medium"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={selectedVideo?.featured ?? false}
            className="h-4 w-4 accent-primary"
          />
          Feature on the vault homepage
        </label>

        <div className="rounded-2xl border border-border bg-background/60 p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider">
            <UploadCloud className="h-3.5 w-3.5 text-primary" />
            Upload requirements
          </div>
          <ul className="mt-3 space-y-1 leading-relaxed">
            <li>Video formats: MP4 or WebM</li>
            <li>Thumbnail formats: JPG, PNG, WebP, or SVG</li>
            <li>Files are stored locally today and can move to a cloud provider later</li>
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Signed in as <span className="font-mono uppercase tracking-wider text-primary">{sessionUser}</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
          >
            {selectedVideo ? <PencilLine className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {isSubmitting ? "Saving..." : selectedVideo ? "Update asset" : "Create asset"}
          </button>
        </div>
      </form>
    </div>
  );
}

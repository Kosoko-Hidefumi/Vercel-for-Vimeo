"use client";

import Image from "next/image";
import { Play, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import type { Video } from "@/lib/videos";

type Props = {
  videos: Video[];
};

export function VideoGallery({ videos }: Props) {
  const [active, setActive] = useState<Video | null>(null);
  const gridLabelId = useId();

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  return (
    <>
      <section
        aria-labelledby={gridLabelId}
        className="mx-auto w-full max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-center gap-2 text-slate-500">
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-500/80" aria-hidden />
          <p id={gridLabelId} className="text-sm font-medium tracking-wide">
            講義を選んで再生
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActive(video)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/75 text-left shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] backdrop-blur-md transition duration-300 ease-out hover:-translate-y-2 hover:border-indigo-200/50 hover:bg-white/90 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.18)] hover:ring-indigo-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <Image
                  src={video.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent opacity-90 transition duration-300 group-hover:from-slate-950/65" />
                <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 text-indigo-600 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.35)] ring-1 ring-white/50 transition duration-300 group-hover:scale-105 group-hover:shadow-[0_16px_48px_-8px_rgba(79,70,229,0.45)]">
                    <Play className="ml-1 h-6 w-6 fill-current" aria-hidden />
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/95 opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                    Play
                  </span>
                </span>
              </div>
              <div className="relative flex flex-1 flex-col gap-2.5 px-5 pb-5 pt-4">
                <span className="absolute left-5 top-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition duration-300 group-hover:opacity-100" />
                <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-slate-900">
                  {video.title}
                </h2>
                <p className="line-clamp-3 text-[13px] leading-relaxed text-slate-600">
                  {video.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="presentation"
        >
          <button
            type="button"
            aria-label="閉じる"
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-md transition-colors duration-200"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            className="gallery-modal-surface relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_32px_80px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/[0.06] backdrop-blur-2xl"
          >
            <div className="relative border-b border-slate-200/70 bg-gradient-to-r from-slate-50/90 via-white to-indigo-50/40 px-5 py-4 sm:px-7 sm:py-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-90" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                    <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-600/80">
                      Now playing
                    </p>
                    <h2
                      id="video-modal-title"
                      className="text-pretty text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
                    >
                      {active.title}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  aria-label="モーダルを閉じる"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="bg-slate-950 p-1.5 sm:p-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
                <iframe
                  title={active.title}
                  src={`https://player.vimeo.com/video/${active.id}`}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="border-t border-slate-100/80 bg-slate-50/50 px-5 py-4 text-sm leading-relaxed text-slate-600 sm:px-7 sm:py-5">
              {active.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

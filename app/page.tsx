import { VideoGallery } from "@/components/VideoGallery";
import { videos as sampleVideos } from "@/lib/sampleVideos";
import { videos as importedVideos } from "@/lib/galleryVideos.generated";

/** 一覧の再生成: `npm run gallery:import` */
const videos = importedVideos.length > 0 ? importedVideos : sampleVideos;

export default function Home() {
  return (
    <div className="relative min-h-full flex-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent"
      />
      <header className="relative border-b border-slate-200/50 bg-white/65 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-violet-600/[0.05]"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                ハワイ大学コンサルタント動画
              </span>
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium tabular-nums text-slate-600 shadow-sm shadow-slate-900/5 backdrop-blur-sm">
              {videos.length}
              <span className="ml-1.5 font-normal text-slate-500">videos</span>
            </span>
          </div>
        </div>
      </header>
      <VideoGallery videos={videos} />
    </div>
  );
}

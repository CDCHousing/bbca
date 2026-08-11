"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeEmbedProps {
  /** The 11-character video id, not the full watch URL. */
  videoId: string;
  title: string;
}

/**
 * Click-to-load YouTube facade.
 *
 * A bare <iframe> pulls roughly a megabyte of YouTube script per embed, and the
 * home page shows three of them. Rendering a thumbnail until the user actually
 * clicks keeps that cost off the initial load.
 */
export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative aspect-video w-full rounded-xl overflow-hidden bg-[#1a1a1a] flex items-center justify-center cursor-pointer"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="relative w-[54px] h-[38px] rounded-lg bg-[rgba(220,32,47,0.92)] flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </span>
    </button>
  );
}

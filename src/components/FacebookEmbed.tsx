"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Canonical post URL, e.g. https://www.facebook.com/events/<id>/permalink/<id>/ — share/p links don't embed. */
  href: string;
  title: string;
};

// Facebook's post plugin draws at a fixed pixel width (350–750) taken from the URL,
// so measure the box and reload the iframe at that width. With show_text=false a
// video post is just the 16:9 player.
export default function FacebookEmbed({ href, title }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      // Round to 10px so small resizes don't reload the video.
      const w = Math.min(750, Math.max(350, Math.floor(box.clientWidth / 10) * 10));
      setWidth((prev) => (prev === w ? prev : w));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const height = Math.ceil((width * 9) / 16);

  return (
    <div ref={boxRef} className="relative aspect-video overflow-hidden bg-[#14203D]">
      {width > 0 && (
        <iframe
          key={width}
          src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(href)}&show_text=false&width=${width}`}
          title={title}
          width={width}
          height={height}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
        />
      )}
    </div>
  );
}

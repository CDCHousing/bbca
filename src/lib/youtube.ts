/**
 * YouTube ids are always 11 characters of [A-Za-z0-9_-].
 */
const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/**
 * Pull the video id out of whatever an admin pastes — a full watch URL, a
 * youtu.be share link, an embed/shorts URL, or the bare id itself.
 * Returns null when nothing usable is found.
 */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  if (ID_PATTERN.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID_PATTERN.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && ID_PATTERN.test(v)) return v;

    // /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length >= 2 && ["embed", "shorts", "live", "v"].includes(segments[0])) {
      return ID_PATTERN.test(segments[1]) ? segments[1] : null;
    }
  }

  return null;
}

export function youTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

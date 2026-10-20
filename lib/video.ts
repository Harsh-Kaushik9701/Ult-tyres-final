/** Shared by server and client components. */
export type VideoSource = { src: string; type: string; mobile?: boolean };

export const MOBILE_QUERY = "(max-width: 768px)";
const AV1 = 'video/mp4; codecs="av01.0.08M.08"';
const H264 = 'video/mp4; codecs="avc1.640028"';

/** Phone file first (matched by media query), then desktop; AV1 before H.264 in each. */
export function videoSources(base: string, mobileBase: string, version = 1): VideoSource[] {
  return [
    { src: `${mobileBase}.av1.mp4?v=${version}`, type: AV1, mobile: true },
    { src: `${mobileBase}.h264.mp4?v=${version}`, type: H264, mobile: true },
    { src: `${base}.av1.mp4?v=${version}`, type: AV1 },
    { src: `${base}.h264.mp4?v=${version}`, type: H264 }
  ];
}

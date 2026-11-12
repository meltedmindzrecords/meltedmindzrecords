import {
  FaInstagram,
  FaSpotify,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
  FaArrowUpRightFromSquare,
  FaFacebook,
} from "react-icons/fa6";
import { SiApplemusic } from "react-icons/si";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Spotify: FaSpotify,
  "Apple Music": SiApplemusic,
  YouTube: FaYoutube,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  X: FaXTwitter,
  Facebook: FaFacebook,
};

export function LinkIcon({ label, className }: { label: string; className?: string }) {
  const Icon = icons[label] ?? icons[label.replace(/^Pre-save on /, "")] ?? FaArrowUpRightFromSquare;
  return <Icon className={className} aria-hidden="true" />;
}

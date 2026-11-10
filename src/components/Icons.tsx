import {
  FaApple,
  FaInstagram,
  FaSpotify,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Spotify: FaSpotify,
  "Apple Music": FaApple,
  YouTube: FaYoutube,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  X: FaXTwitter,
};

export function LinkIcon({ label, className }: { label: string; className?: string }) {
  const Icon = icons[label] ?? FaArrowUpRightFromSquare;
  return <Icon className={className} aria-hidden="true" />;
}

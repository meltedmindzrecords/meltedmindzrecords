"use client";

import CmsManager from "../CmsManager";
import { artistsConfig } from "../cms";

export default function AdminArtistsPage() {
  return <CmsManager config={artistsConfig} />;
}

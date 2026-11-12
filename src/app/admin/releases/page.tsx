"use client";

import CmsManager from "../CmsManager";
import { releasesConfig } from "../cms";

export default function AdminReleasesPage() {
  return <CmsManager config={releasesConfig} />;
}

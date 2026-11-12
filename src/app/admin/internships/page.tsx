"use client";

import CmsManager from "../CmsManager";
import { internshipsConfig } from "../cms";

export default function AdminInternshipsPage() {
  return <CmsManager config={internshipsConfig} />;
}

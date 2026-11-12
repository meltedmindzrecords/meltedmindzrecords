"use client";

import CmsManager from "../CmsManager";
import { newsConfig } from "../cms";

export default function AdminNewsPage() {
  return <CmsManager config={newsConfig} />;
}

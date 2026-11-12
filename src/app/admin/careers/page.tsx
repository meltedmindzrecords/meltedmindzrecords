"use client";

import CmsManager from "../CmsManager";
import { careersConfig } from "../cms";

export default function AdminCareersPage() {
  return <CmsManager config={careersConfig} />;
}

"use client";

import CmsManager from "../CmsManager";
import { teamConfig } from "../cms";

export default function AdminTeamPage() {
  return <CmsManager config={teamConfig} />;
}

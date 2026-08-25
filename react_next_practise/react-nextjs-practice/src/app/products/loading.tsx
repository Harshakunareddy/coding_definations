// ==========================================
// LOADING UI (Next.js App Router feature)
// This file automatically shows while the page is loading
// Works with Server Components and Suspense
// ==========================================

import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return <LoadingSpinner />;
}

import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache'

// Incremental cache (ISR) backed by Workers KV.
//
// Without this every public page carried `force-dynamic`, so Cloudflare
// answered each request by rendering in the Worker and reading VIZON_KV — the
// HTML went out as `no-store` and never touched the edge cache. From a phone on
// a slow network in another region that is the "loads insanely slowly" report:
// a full round trip to the Worker for every page, every visit.
//
// Now the pages are ISR. The rendered HTML lives in the NEXT_INC_CACHE_KV
// namespace and Cloudflare serves it from the edge; `revalidate` on each page
// re-renders it from the live VIZON_KV data in the background, so admin edits
// still appear within the revalidate window. R2 is the more common backing
// store for this, but it needs a dashboard activation this account does not
// have yet; KV is already enabled and is a fine fit at this size.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
})

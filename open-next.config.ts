import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache'
import memoryQueue from '@opennextjs/cloudflare/overrides/queue/memory-queue'

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
// Revalidation queue.
//
// Without one, OpenNext falls back to a placeholder that throws
// `FatalError: Dummy queue is not implemented` the moment any page passes its
// `revalidate` window. That failure was silent in two different ways: ordinary
// pages went on serving their stale copy with a 200, so nothing looked wrong,
// and the whole point of `revalidate: 60` — admin edits reaching the live site
// within a minute — never actually worked. Content only ever changed on a
// redeploy.
//
// It is not harmless, either. In a local Workers preview the dynamic case and
// service pages returned 404 rather than stale content once their entry went
// stale, because a failed revalidation leaves nothing to serve for a route that
// is generated on demand.
//
// The memory queue re-requests the route through the Worker itself, which is
// why it needs the WORKER_SELF_REFERENCE service binding in wrangler.jsonc. It
// de-dupes per isolate, so a burst of traffic on one stale page triggers one
// revalidation rather than one per request. The Durable Object queue is the
// sturdier option and worth revisiting if this site ever gets busy enough for
// per-isolate de-duping to matter.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  queue: memoryQueue,
})

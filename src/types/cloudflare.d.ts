// Cloudflare KV types for data layer
interface KVNamespace {
  get(key: string, type?: 'text'): Promise<string | null>
  get(key: string, type: 'json'): Promise<unknown>
  get(key: string, type: 'arrayBuffer'): Promise<ArrayBuffer | null>
  get(key: string, type: 'stream'): Promise<ReadableStream | null>
  put(key: string, value: string | ArrayBuffer | ReadableStream): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: { name: string; expiration?: number; metadata?: unknown }[]
    list_complete: boolean
    cursor?: string
  }>
}

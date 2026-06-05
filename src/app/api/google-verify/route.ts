export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response('google-site-verification: googlebefbf6c3af6fc6de.html', {
    headers: { 'Content-Type': 'text/html' },
  })
}

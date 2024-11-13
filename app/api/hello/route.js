// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' })
// }

// export default function handler(req, res) {
//   res.status(200).json({ message: 'Hello from Next.js!' })
// }

export async function GET(req) {
  return new Response(JSON.stringify({ message: 'Hello from Next.js!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
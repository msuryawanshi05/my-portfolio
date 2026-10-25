// Cloudflare Pages Function: POST /api/contact
//
// Bindings required before this works:
//   - KV namespace bound as  RL              (rate limiting)
//   - Secret                 RESEND_API_KEY  (https://resend.com)
//   - Var                    CONTACT_TO      (destination address)
//
// Until those exist the endpoint returns 502 and the client falls back to
// showing the direct email address, so the form degrades instead of lying.

const MAX = { name: 100, email: 254, message: 4000 };
const MIN = { name: 2, message: 20 };
const RATE_LIMIT = 3; // messages per IP per hour

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Malformed request.' }, 400);
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();

  // Honeypot: a real user never sees this field. Return success so the bot
  // records a win and does not retry with a different shape.
  if (String(body.company ?? '').trim()) return json({ ok: true });

  if (name.length < MIN.name || name.length > MAX.name)
    return json({ error: `Name must be ${MIN.name} to ${MAX.name} characters.` }, 400);
  if (email.length > MAX.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return json({ error: 'Enter a valid email address.' }, 400);
  if (message.length < MIN.message || message.length > MAX.message)
    return json({ error: `Message must be ${MIN.message} to ${MAX.message} characters.` }, 400);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';

  // Fixed-window limiter. Coarse, but it only has to stop casual abuse and it
  // costs one KV read per submit.
  if (env.RL) {
    const key = `rl:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
    const used = Number((await env.RL.get(key)) ?? 0);
    if (used >= RATE_LIMIT)
      return json({ error: 'Too many messages. Try again in an hour.' }, 429);
    await env.RL.put(key, String(used + 1), { expirationTtl: 3600 });
  }

  if (!env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY not configured');
    return json({ error: 'Contact form is not configured yet.' }, 502);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: 'portfolio@msuryawanshi05.antideploy.app',
      to: env.CONTACT_TO ?? 'msuryawanshi.1945@gmail.com',
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `${name} <${email}>\nIP: ${ip}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error('contact: resend failed', res.status, await res.text());
    return json({ error: 'Could not send right now.' }, 502);
  }

  return json({ ok: true });
}

// Non-POST methods. (A bare `onRequest` export would swallow onRequestPost,
// so each method is declared separately.)
const notAllowed = () => json({ error: 'Method not allowed.' }, 405);
export const onRequestGet = notAllowed;
export const onRequestPut = notAllowed;
export const onRequestDelete = notAllowed;
export const onRequestPatch = notAllowed;

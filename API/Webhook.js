export default async function handler(req, res) {
  // Only allow POST requests.  GET requests return a simple message.
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST only' });
  }

  // Attempt to parse the incoming JSON payload.
  let payload = {};
  try {
    payload = req.body ?? {};
  } catch (_) {
    // Keep payload empty if parsing fails.
  }

  // Optional: forward to an external integration (e.g. Zapier/Make)
  let forwardStatus = null;
  const forwardUrl = process.env.FORWARD_URL;
  if (forwardUrl) {
    try {
      const forwardResponse = await fetch(forwardUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      forwardStatus = forwardResponse.status;
    } catch (error) {
      forwardStatus = 'error';
    }
  }

  // Respond with success and echo the received payload.  Include forward status for debugging.
  return res.status(200).json({ ok: true, received: payload, forwarded: forwardStatus });
}

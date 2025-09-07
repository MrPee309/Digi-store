// /api/proxy — Vercel Serverless Function (Node 18)
// Purpose: call your provider API without exposing secrets on the client.
// Configure ENV vars in Vercel: PROVIDER_BASE_URL, PROVIDER_API_KEY
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  try{
    const { imei } = req.body || {};
    const base = process.env.PROVIDER_BASE_URL;
    const key = process.env.PROVIDER_API_KEY;
    if(!base || !key) return res.status(500).send('Proxy not configured');
    const upstream = await fetch(`${base}/check`, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body: JSON.stringify({ imei })
    });
    const text = await upstream.text();
    res.status(upstream.status).send(text);
  }catch(e){
    res.status(500).send(e.message || 'Proxy error');
  }
}

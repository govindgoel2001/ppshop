// api/config.js — public runtime config served to the browser
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  return res.status(200).json({
    upiVpa:         process.env.UPI_VPA || '',
    upiDisplayName: process.env.UPI_DISPLAY_NAME || 'AthenaBioLabs',
    ga4Id:          process.env.GA4_ID || '',
    fbPixelId:      process.env.FB_PIXEL_ID || '',
  });
}

// devserver.mjs — local static dev server that respects vercel.json cleanUrls + rewrites.
// Usage: node devserver.mjs [port]
// Does NOT run API routes (those need `vercel dev` + env vars).

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = parseInt(process.argv[2] || '8888', 10);
const ROOT = path.dirname(fileURLToPath(import.meta.url));

// Rewrites from vercel.json (source = clean URL, destination = file path)
const REWRITES = [
  ['/about',       '/index.html'],
  ['/coa',         '/index.html'],
  ['/contact',     '/index.html'],
  ['/shop',        '/index.html'],
  ['/catalogue',   '/catalogue.html'],
  ['/calculator',  '/calculator.html'],
  ['/admin',       '/admin/index.html'],
  ['/admin/login', '/admin/login.html'],
  ['/admin/order', '/admin/order.html'],
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
};

function resolve(urlPath) {
  // 1. Exact rewrite match
  const rewrite = REWRITES.find(([src]) => src === urlPath);
  if (rewrite) return path.join(ROOT, rewrite[1]);

  // 2. API routes — signal caller to return 501
  if (urlPath.startsWith('/api/')) return null;

  // 3. Try exact file
  const candidate = path.join(ROOT, urlPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;

  // 4. cleanUrls: try appending .html
  const withHtml = candidate + '.html';
  if (fs.existsSync(withHtml)) return withHtml;

  // 5. Directory index
  const indexHtml = path.join(candidate, 'index.html');
  if (fs.existsSync(indexHtml)) return indexHtml;

  return undefined;
}

const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, 'http://localhost').pathname;
  const file = resolve(urlPath);

  if (file === null) {
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('API routes require `vercel dev`. Run: npm run dev');
    return;
  }
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  try {
    const data = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': mime, 'Content-Length': data.length });
    res.end(data);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Dev server: http://127.0.0.1:${PORT}/`);
  console.log('  Clean URLs active. API routes return 501 (needs vercel dev).\n');
});

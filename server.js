import { join } from 'node:path';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3000);
const publicFolder = join(import.meta.dirname, 'public');

const courses = [
  { id: 'WEB101', title: 'HTML and CSS', credits: 3 },
  { id: 'WEB102', title: 'JavaScript Fundamentals', credits: 3 },
  { id: 'WEB103', title: 'Introduction to Back-End Development', credits: 3 }
];

let requestsServed = 0;

function logRequest(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
}

function countRequest(req, res, next) {
  requestsServed += 1;
  next();
}

app.use(logRequest);
app.use(countRequest);

app.get('/', (req, res) => {
  res.sendFile(join(publicFolder, 'index.html'));
});

app.get('/hello', (req, res) => {
  res.type('text/plain').send("Hello from ahmed's server");
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /api/admin\n');
});

app.get('/old-page', (req, res) => {
  res.redirect(302, '/hello');
});

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    nodeVersion: process.version,
    uptimeSeconds: process.uptime()
  });
});

app.get('/api/headers', (req, res) => {
  res.json({
    'User-Agent': req.get('User-Agent') ?? null,
    Accept: req.get('Accept') ?? null
  });
});

app.post('/api/subscribe', (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

app.get('/api/stats', (req, res) => {
  res.json({ requestsServed });
});

app.use(express.static(publicFolder));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(404).type('text/plain').send('Page not found');
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${server.address().port}`);
});

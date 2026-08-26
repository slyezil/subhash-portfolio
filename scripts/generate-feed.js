const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '../src/posts');
const outputFile = path.join(__dirname, '../public/feed.xml');

const SITE_URL = 'https://slyezil.github.io/subhash-portfolio';
const SITE_TITLE = 'Subhash Chandra Bose Lavu // Writing.Log';
const SITE_DESC = 'Writing on full-stack engineering, LLMs, and building systems.';

function getPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        description: data.description || '',
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const posts = getPosts();

const items = posts
  .map(
    (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/post/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/post/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`
  )
  .join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}/blog</link>
    <description>${SITE_DESC}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

fs.writeFileSync(outputFile, feed);
console.log(`Generated RSS feed with ${posts.length} entries at ${outputFile}`);

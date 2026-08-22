const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '../src/posts');
const outputFile = path.join(__dirname, '../public/sitemap.xml');

const DOMAIN = 'https://slyezil.github.io/subhash-portfolio';

function getPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const { data } = matter(fs.readFileSync(path.join(postsDirectory, fileName), 'utf8'));
      return { slug, date: data.date ? new Date(data.date).toISOString().split('T')[0] : null };
    });
}

const posts = getPosts();

const urls = [
  { loc: '/', lastmod: null, priority: '1.0' },
  { loc: '/blog', lastmod: posts[0] ? posts[0].date : null, priority: '0.8' },
  ...posts.map((p) => ({ loc: `/post/${p.slug}`, lastmod: p.date, priority: '0.6' }))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `\t<url>\n\t\t<loc>${DOMAIN}${u.loc}</loc>${
        u.lastmod ? `\n\t\t<lastmod>${u.lastmod}</lastmod>` : ''
      }\n\t\t<priority>${u.priority}</priority>\n\t</url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(outputFile, xml);
console.log(`Generated sitemap with ${urls.length} URLs at ${outputFile}`);

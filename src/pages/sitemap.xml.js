function generateSiteMap() {
  const surahs = Array.from({ length: 114 }, (_, i) => i + 1);

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://msr-quran-app.vercel.app</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://msr-quran-app.vercel.app/live</loc>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://msr-quran-app.vercel.app/quran-sound</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://msr-quran-app.vercel.app/quran-pdf</loc>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://msr-quran-app.vercel.app/quran-reader</loc>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://msr-quran-app.vercel.app/chat-bot</loc>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     ${surahs
       .map((id) => {
         return `
       <url>
           <loc>https://msr-quran-app.vercel.app/quran/${id}</loc>
           <changefreq>monthly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;

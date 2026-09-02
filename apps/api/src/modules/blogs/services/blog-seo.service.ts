import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BlogSeoService {
  constructor(private readonly prisma: PrismaService) { }

  async generateSitemapXml(baseUrl: string): Promise<string> {
    const blogs = await this.prisma.prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    const categories = await this.prisma.prisma.blogCategory.findMany({
      select: { slug: true },
    });

    const siteUrl = baseUrl.replace(/\/$/, '');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemap.orgs/schemas/sitemap/0.9">\n`;

    // Main Blog index page
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/blogs</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Category pages
    categories.forEach((cat: any) => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/blogs?category=${cat.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Blog Articles
    blogs.forEach((b: any) => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/blogs/${b.slug}</loc>\n`;
      xml += `    <lastmod>${b.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  }

  async generateRssFeedXml(baseUrl: string): Promise<string> {
    const blogs = await this.prisma.prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      take: 25,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true } },
      },
    });

    const siteUrl = baseUrl.replace(/\/$/, '');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
    xml += `  <channel>\n`;
    xml += `    <title>Auction11 Blog &amp; Insights</title>\n`;
    xml += `    <link>${siteUrl}/blogs</link>\n`;
    xml += `    <description>Latest news, guides, and tech insights on live sports auctions and tournament management.</description>\n`;
    xml += `    <language>en-us</language>\n`;
    xml += `    <atom:link href="${siteUrl}/blogs/rss.xml" rel="self" type="application/rss+xml"/>\n`;

    blogs.forEach((b: any) => {
      const pubDate = b.publishedAt ? new Date(b.publishedAt).toUTCString() : new Date(b.createdAt).toUTCString();
      xml += `    <item>\n`;
      xml += `      <title><![CDATA[${b.title}]]></title>\n`;
      xml += `      <link>${siteUrl}/blogs/${b.slug}</link>\n`;
      xml += `      <guid isPermaLink="true">${siteUrl}/blogs/${b.slug}</guid>\n`;
      xml += `      <pubDate>${pubDate}</pubDate>\n`;
      xml += `      <author><![CDATA[${b.author?.name || 'Auction11 Team'}]]></author>\n`;
      xml += `      <description><![CDATA[${b.excerpt || b.subtitle || ''}]]></description>\n`;
      xml += `    </item>\n`;
    });

    xml += `  </channel>\n`;
    xml += `</rss>`;
    return xml;
  }

  buildJsonLd(blog: any, baseUrl: string) {
    const siteUrl = baseUrl.replace(/\/$/, '');
    const articleUrl = `${siteUrl}/blogs/${blog.slug}`;
    const authorName = blog.author?.name || 'Auction11 Team';
    const heroImg = blog.coverImage || blog.heroImage || `${siteUrl}/images/default-blog.jpg`;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      headline: blog.title,
      description: blog.excerpt || blog.subtitle,
      image: [heroImg],
      datePublished: blog.publishedAt || blog.createdAt,
      dateModified: blog.updatedAt,
      author: {
        '@type': 'Person',
        name: authorName,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Auction11',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/final-1.png`,
        },
      },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${siteUrl}/blogs`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: blog.title,
          item: articleUrl,
        },
      ],
    };

    return [articleSchema, breadcrumbSchema];
  }
}

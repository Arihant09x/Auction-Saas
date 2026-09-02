import { Controller, Get, Post, Param, Query, Req, Res, Headers } from '@nestjs/common';
import type { Response } from 'express';
import { BlogsService } from './blogs.service';
import { BlogCategoryService } from './services/blog-category.service';
import { BlogTagService } from './services/blog-tag.service';
import { BlogAnalyticsService } from './services/blog-analytics.service';
import { BlogSeoService } from './services/blog-seo.service';
import { QueryBlogDto } from './dto/query-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly categoryService: BlogCategoryService,
    private readonly tagService: BlogTagService,
    private readonly analyticsService: BlogAnalyticsService,
    private readonly seoService: BlogSeoService,
  ) { }

  @Get()
  getPublicBlogs(@Query() query: QueryBlogDto) {
    return this.blogsService.getPublicBlogs(query);
  }

  @Get('categories')
  getCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('tags')
  getTags() {
    return this.tagService.getAllTags();
  }

  @Get('rss.xml')
  async getRssFeed(@Headers('host') host: string, @Res() res: Response) {
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host || 'auction11.live'}`;
    const xml = await this.seoService.generateRssFeedXml(baseUrl);
    res.set('Content-Type', 'application/xml');
    return res.send(xml);
  }

  @Get('sitemap.xml')
  async getSitemap(@Headers('host') host: string, @Res() res: Response) {
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host || 'auction11.live'}`;
    const xml = await this.seoService.generateSitemapXml(baseUrl);
    res.set('Content-Type', 'application/xml');
    return res.send(xml);
  }

  @Get(':slug')
  async getBlogBySlug(
    @Param('slug') slug: string,
    @Headers('host') host: string,
  ) {
    const blog = await this.blogsService.getPublicBlogBySlug(slug);
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host || 'auction11.live'}`;
    const jsonLd = this.seoService.buildJsonLd(blog, baseUrl);

    return {
      ...blog,
      jsonLd,
    };
  }

  @Post(':id/view')
  recordView(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers['referer'];
    return this.analyticsService.recordView(id, ip, userAgent, referrer);
  }

  @Post(':id/like')
  recordLike(@Param('id') id: string) {
    return this.analyticsService.recordLike(id);
  }
}

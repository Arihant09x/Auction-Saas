import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { AdminBlogsController } from './admin-blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogCategoryService } from './services/blog-category.service';
import { BlogTagService } from './services/blog-tag.service';
import { BlogMediaService } from './services/blog-media.service';
import { BlogAnalyticsService } from './services/blog-analytics.service';
import { BlogAiService } from './services/blog-ai.service';
import { BlogSeoService } from './services/blog-seo.service';

@Module({
  controllers: [BlogsController, AdminBlogsController],
  providers: [
    BlogsService,
    BlogCategoryService,
    BlogTagService,
    BlogMediaService,
    BlogAnalyticsService,
    BlogAiService,
    BlogSeoService,
  ],
  exports: [
    BlogsService,
    BlogCategoryService,
    BlogTagService,
    BlogMediaService,
    BlogAnalyticsService,
    BlogAiService,
    BlogSeoService,
  ],
})
export class BlogsModule {}

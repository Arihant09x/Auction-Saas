import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BlogsService } from './blogs.service';
import { BlogCategoryService } from './services/blog-category.service';
import { BlogTagService } from './services/blog-tag.service';
import { BlogMediaService } from './services/blog-media.service';
import { BlogAnalyticsService } from './services/blog-analytics.service';
import { BlogAiService } from './services/blog-ai.service';
import { CreateBlogDto, BlogStatusEnum } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { CreateCategoryDto, CreateTagDto } from './dto/category-tag.dto';
import { AiGenerateDraftDto, AiSeoSuggestDto } from './dto/ai-assist.dto';

@Controller('blogs/admin')
@UseGuards(AuthGuard('firebase-jwt'), RolesGuard)
export class AdminBlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly categoryService: BlogCategoryService,
    private readonly tagService: BlogTagService,
    private readonly mediaService: BlogMediaService,
    private readonly analyticsService: BlogAnalyticsService,
    private readonly aiService: BlogAiService,
  ) {}

  @Get('analytics')
  getAnalytics() {
    return this.analyticsService.getDashboardAnalytics();
  }

  @Get('list')
  getAdminBlogs(@Query() query: QueryBlogDto) {
    return this.blogsService.getAdminBlogs(query);
  }

  @Get(':id')
  getAdminBlogById(@Param('id') id: string) {
    return this.blogsService.getAdminBlogById(id);
  }

  @Post()
  createBlog(@Body() dto: CreateBlogDto, @Req() req: any) {
    const authorId = req.user?.id;
    return this.blogsService.createBlog(dto, authorId);
  }

  @Put(':id')
  updateBlog(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.blogsService.updateBlog(id, dto, userId);
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }

  @Post(':id/duplicate')
  duplicateBlog(@Param('id') id: string, @Req() req: any) {
    const authorId = req.user?.id;
    return this.blogsService.duplicateBlog(id, authorId);
  }

  @Post(':id/revert/:revisionId')
  rollbackRevision(
    @Param('id') id: string,
    @Param('revisionId') revisionId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.blogsService.rollbackRevision(id, revisionId, userId);
  }

  @Patch('bulk/status')
  bulkUpdateStatus(@Body() body: { ids: string[]; status: BlogStatusEnum }) {
    return this.blogsService.bulkUpdateStatus(body.ids, body.status);
  }

  @Post('bulk/delete')
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.blogsService.bulkDelete(body.ids);
  }

  // --- CATEGORIES MANAGEMENT ---
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: Partial<CreateCategoryDto>) {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  // --- TAGS MANAGEMENT ---
  @Post('tags')
  createTag(@Body() dto: CreateTagDto) {
    return this.tagService.createTag(dto);
  }

  @Delete('tags/:id')
  deleteTag(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }

  // --- MEDIA LIBRARY & CLOUDINARY ---
  @Get('media/list')
  getMedia(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.mediaService.getAllMedia(Number(page) || 1, Number(limit) || 20, search);
  }

  @Post('media/upload')
  uploadMedia(@Body() body: { base64: string; altText?: string; caption?: string; folder?: string }) {
    return this.mediaService.uploadImageBase64(body.base64, body.altText, body.caption, body.folder);
  }

  @Delete('media/:id')
  deleteMedia(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }

  // --- AI ASSISTANT ---
  @Post('ai/generate-draft')
  generateAiDraft(@Body() dto: AiGenerateDraftDto) {
    return this.aiService.generateDraft(dto);
  }

  @Post('ai/suggest-seo')
  suggestSeo(@Body() dto: AiSeoSuggestDto) {
    return this.aiService.suggestSeo(dto);
  }

  @Post('ai/summarize')
  summarizeContent(@Body() body: { content: string }) {
    return this.aiService.summarizeContent(body.content);
  }
}

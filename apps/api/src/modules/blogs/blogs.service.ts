import { Injectable, NotFoundException, BadRequestException, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { REDIS_CLIENT } from '../../redis/redis.provider';
import Redis from 'ioredis';
import { CreateBlogDto, BlogStatusEnum } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { BlogTagService } from './services/blog-tag.service';
import { validateBlockNoteContent, sanitizeBlockNoteDocument } from '@repo/blocknote-content';
// @ts-ignore – the package exists but its types are not found by TypeScript
import { Prisma } from '@repo/database_postgres';

const REDIS_BLOG_CACHE_PREFIX = 'blog:cache:';
const REDIS_PUBLIC_BLOGS_KEY = 'blog:cache:public_list';
const CACHE_TTL_SECONDS = 3600; // 1 hour

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tagService: BlogTagService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) { }

  /**
   * Strict server-side validation + sanitization of blockContent.
   * Returns a Prisma-safe native JSON value or throws BadRequestException.
   * Pass undefined/null to skip (field will be left unchanged).
   */
  private validateAndSanitizeBlockContent(raw: any[] | undefined | null): Prisma.InputJsonValue | undefined {
    if (raw === undefined || raw === null) return undefined;
    if (!Array.isArray(raw)) {
      throw new BadRequestException('blockContent must be an array of BlockNote blocks');
    }
    const validationResult = validateBlockNoteContent(raw);
    if (!validationResult.success) {
      // Changed 'errors' to 'error' (singular)
      throw new BadRequestException(`Invalid blockContent: ${validationResult.error || 'Unknown error'}`);
    }
    const sanitized = sanitizeBlockNoteDocument(raw);
    // Ensure it is a plain JSON-serializable value — never a string
    return JSON.parse(JSON.stringify(sanitized)) as Prisma.InputJsonValue;
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  private calculateReadingTime(content: string): number {
    const cleanText = content.replace(/<[^>]*>?/gm, '').replace(/#|\*|`|>|-/g, '');
    const wordCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }

  private async generateUniqueSlug(title: string, customSlug?: string, currentBlogId?: string): Promise<string> {
    const baseSlug = customSlug ? this.slugify(customSlug) : this.slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.prisma.blog.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || (currentBlogId && existing.id === currentBlogId)) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private async invalidateCache() {
    try {
      const keys = await this.redis.keys(`${REDIS_BLOG_CACHE_PREFIX}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (err: any) {
      this.logger.error(`Redis cache invalidation error: ${err.message}`);
    }
  }

  // ==========================================
  // PUBLIC READ METHODS
  // ==========================================

  async getPublicBlogs(query: QueryBlogDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { subtitle: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.categories = {
        some: {
          category: {
            OR: [
              { slug: query.category },
              { id: query.category },
            ],
          },
        },
      };
    }

    if (query.tag) {
      where.tags = {
        some: {
          tag: {
            OR: [
              { slug: query.tag },
              { id: query.tag },
            ],
          },
        },
      };
    }

    if (query.featuredOnly === 'true') {
      where.isFeatured = true;
    }

    if (query.trendingOnly === 'true') {
      where.isTrending = true;
    }

    let orderBy: any = { publishedAt: 'desc' };
    if (query.sortBy === 'viewsCount') {
      orderBy = { viewsCount: 'desc' };
    } else if (query.sortBy === 'createdAt') {
      orderBy = { createdAt: 'desc' };
    } else if (query.sortBy === 'title') {
      orderBy = { title: 'asc' };
    }

    const [blogs, total] = await Promise.all([
      this.prisma.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: { id: true, name: true, profileUrl: true, email: true },
          },
          categories: {
            include: { category: true },
          },
          tags: {
            include: { tag: true },
          },
        },
      }),
      this.prisma.prisma.blog.count({ where }),
    ]);

    const formattedBlogs = blogs.map((b: any) => ({
      ...b,
      categories: b.categories.map((c: any) => c.category),
      tags: b.tags.map((t: any) => t.tag),
    }));

    return {
      items: formattedBlogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublicBlogBySlug(slug: string) {
    // 1. Try Redis cache
    const cacheKey = `${REDIS_BLOG_CACHE_PREFIX}slug:${slug}`;
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err: any) {
      this.logger.error(`Redis read error: ${err.message}`);
    }

    // 2. Fetch from DB
    let blog = await this.prisma.prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, profileUrl: true, email: true },
        },
        categories: {
          include: { category: true },
        },
        tags: {
          include: { tag: true },
        },
        seo: true,
      },
    });

    // If not found by slug, check slug history for 301 redirects
    if (!blog) {
      const slugHist = await this.prisma.prisma.blogSlugHistory.findUnique({
        where: { oldSlug: slug },
        include: {
          blog: {
            include: {
              author: { select: { id: true, name: true, profileUrl: true, email: true } },
              categories: { include: { category: true } },
              tags: { include: { tag: true } },
              seo: true,
            },
          },
        },
      });

      if (slugHist && slugHist.blog && slugHist.blog.status === 'PUBLISHED') {
        blog = slugHist.blog;
      }
    }

    if (!blog || blog.status !== 'PUBLISHED') {
      throw new NotFoundException(`Blog article not found`);
    }

    const formattedBlog = {
      ...blog,
      categories: blog.categories.map((c: any) => c.category),
      tags: blog.tags.map((t: any) => t.tag),
    };

    // Cache in Redis
    try {
      await this.redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(formattedBlog));
    } catch (err: any) {
      this.logger.error(`Redis cache write error: ${err.message}`);
    }

    return formattedBlog;
  }

  // ==========================================
  // ADMIN CMS METHODS
  // ==========================================

  async getAdminBlogs(query: QueryBlogDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { subtitle: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.categories = {
        some: {
          category: {
            OR: [
              { slug: query.category },
              { id: query.category },
            ],
          },
        },
      };
    }

    const sortField = query.sortBy || 'updatedAt';
    const sortOrder = query.sortOrder || 'desc';

    const [blogs, total] = await Promise.all([
      this.prisma.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        include: {
          author: {
            select: { id: true, name: true, profileUrl: true, email: true },
          },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          seo: true,
          _count: { select: { revisions: true } },
        },
      }),
      this.prisma.prisma.blog.count({ where }),
    ]);

    const formattedBlogs = blogs.map((b: any) => ({
      ...b,
      categories: b.categories.map((c: any) => c.category),
      tags: b.tags.map((t: any) => t.tag),
      revisionsCount: b._count.revisions,
    }));

    return {
      items: formattedBlogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAdminBlogById(id: string) {
    const blog = await this.prisma.prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, profileUrl: true, email: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        seo: true,
        revisions: {
          orderBy: { revisionNum: 'desc' },
          take: 15,
        },
      },
    });

    if (!blog) throw new NotFoundException('Blog article not found');

    return {
      ...blog,
      categories: blog.categories.map((c: any) => c.category),
      tags: blog.tags.map((t: any) => t.tag),
    };
  }

  async createBlog(dto: CreateBlogDto, authorId?: string) {
    // Validate & sanitize BlockNote content (throws BadRequestException on invalid input)
    const blockContentValue = this.validateAndSanitizeBlockContent(dto.blockContent);

    const contentText = dto.content ?? '';
    const slug = await this.generateUniqueSlug(dto.title, dto.slug);
    const readingTime = this.calculateReadingTime(contentText);
    const status = dto.status || BlogStatusEnum.DRAFT;
    const publishedAt = status === BlogStatusEnum.PUBLISHED
      ? (dto.publishedAt ? new Date(dto.publishedAt) : new Date())
      : (dto.publishedAt ? new Date(dto.publishedAt) : null);

    // Dynamic tag handling
    let tagIds = dto.tagIds || [];
    if (dto.tagNames && dto.tagNames.length > 0) {
      const createdTags = await this.tagService.findOrCreateTagsByName(dto.tagNames);
      tagIds = Array.from(new Set([...tagIds, ...createdTags.map((t) => t.id)]));
    }

    const blog = await this.prisma.prisma.$transaction(async (tx: any) => {
      const created = await tx.blog.create({
        data: {
          title: dto.title,
          slug,
          subtitle: dto.subtitle,
          excerpt: dto.excerpt || (dto.subtitle ? dto.subtitle : contentText.slice(0, 160)),
          content: contentText,
          ...(blockContentValue !== undefined ? { blockContent: blockContentValue } : {}),
          status: status as any,
          coverImage: dto.coverImage,
          thumbnailImage: dto.thumbnailImage || dto.coverImage,
          heroImage: dto.heroImage || dto.coverImage,
          readingTime,
          isFeatured: dto.isFeatured || false,
          isPinned: dto.isPinned || false,
          isTrending: dto.isTrending || false,
          allowComments: dto.allowComments ?? true,
          publishedAt,
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
          authorId,
          seo: {
            create: {
              metaTitle: dto.metaTitle || dto.title,
              metaDescription: dto.metaDescription || dto.excerpt,
              keywords: dto.keywords,
              canonicalUrl: dto.canonicalUrl,
              ogImage: dto.ogImage || dto.coverImage,
            },
          },
          categories: {
            create: (dto.categoryIds || []).map((catId) => ({
              categoryId: catId,
            })),
          },
          tags: {
            create: tagIds.map((tId) => ({
              tagId: tId,
            })),
          },
          revisions: {
            create: {
              revisionNum: 1,
              title: dto.title,
              subtitle: dto.subtitle,
              excerpt: dto.excerpt,
              content: contentText,
              ...(blockContentValue !== undefined ? { blockContent: blockContentValue } : {}),
              createdBy: authorId,
            },
          },
        },
      });

      return created;
    });

    await this.invalidateCache();
    return this.getAdminBlogById(blog.id);
  }

  async updateBlog(id: string, dto: UpdateBlogDto, userId?: string) {
    const existing = await this.prisma.prisma.blog.findUnique({
      where: { id },
      include: {
        revisions: { orderBy: { revisionNum: 'desc' }, take: 1 },
      },
    });
    if (!existing) throw new NotFoundException('Blog article not found');

    // Handle slug change & slug history tracking
    let newSlug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      newSlug = await this.generateUniqueSlug(dto.title || existing.title, dto.slug, id);
      await this.prisma.prisma.blogSlugHistory.create({
        data: {
          blogId: id,
          oldSlug: existing.slug,
        },
      }).catch(() => null); // Ignore duplicate oldSlug error
    } else if (dto.title && dto.title !== existing.title && !dto.slug) {
      // Re-generate slug if title changed and slug not manually fixed
      newSlug = await this.generateUniqueSlug(dto.title, undefined, id);
      await this.prisma.prisma.blogSlugHistory.create({
        data: {
          blogId: id,
          oldSlug: existing.slug,
        },
      }).catch(() => null);
    }

    // Validate & sanitize incoming blockContent
    const blockContentValue = this.validateAndSanitizeBlockContent((dto as any).blockContent);

    const content = dto.content ?? existing.content;
    const readingTime = this.calculateReadingTime(content);
    const lastRevNum = existing.revisions[0]?.revisionNum || 0;

    let status = existing.status;
    let publishedAt = existing.publishedAt;
    if (dto.status) {
      status = dto.status as any;
      if (status === BlogStatusEnum.PUBLISHED && !publishedAt) {
        publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : new Date();
      }
    }

    // Dynamic tag handling
    let tagIds = dto.tagIds;
    if (dto.tagNames && dto.tagNames.length > 0) {
      const createdTags = await this.tagService.findOrCreateTagsByName(dto.tagNames);
      tagIds = Array.from(new Set([...(tagIds || []), ...createdTags.map((t) => t.id)]));
    }

    await this.prisma.prisma.$transaction(async (tx: any) => {
      // Update core Blog fields
      await tx.blog.update({
        where: { id },
        data: {
          title: dto.title ?? existing.title,
          slug: newSlug,
          subtitle: dto.subtitle ?? existing.subtitle,
          excerpt: dto.excerpt ?? existing.excerpt,
          content,
          ...(blockContentValue !== undefined ? { blockContent: blockContentValue } : {}),
          status: status as any,
          coverImage: dto.coverImage ?? existing.coverImage,
          thumbnailImage: dto.thumbnailImage ?? existing.thumbnailImage,
          heroImage: dto.heroImage ?? existing.heroImage,
          readingTime,
          isFeatured: dto.isFeatured ?? existing.isFeatured,
          isPinned: dto.isPinned ?? existing.isPinned,
          isTrending: dto.isTrending ?? existing.isTrending,
          allowComments: dto.allowComments ?? existing.allowComments,
          publishedAt,
          scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : existing.scheduledAt,
        },
      });

      // Update Categories if provided
      if (dto.categoryIds) {
        await tx.blogCategoryMapping.deleteMany({ where: { blogId: id } });
        await tx.blogCategoryMapping.createMany({
          data: dto.categoryIds.map((catId) => ({
            blogId: id,
            categoryId: catId,
          })),
        });
      }

      // Update Tags if provided
      if (tagIds) {
        await tx.blogTagMapping.deleteMany({ where: { blogId: id } });
        await tx.blogTagMapping.createMany({
          data: tagIds.map((tId) => ({
            blogId: id,
            tagId: tId,
          })),
        });
      }

      // Update SEO
      if (dto.metaTitle || dto.metaDescription || dto.keywords || dto.canonicalUrl || dto.ogImage) {
        await tx.blogSEO.upsert({
          where: { blogId: id },
          create: {
            blogId: id,
            metaTitle: dto.metaTitle || dto.title || existing.title,
            metaDescription: dto.metaDescription || dto.excerpt || existing.excerpt,
            keywords: dto.keywords,
            canonicalUrl: dto.canonicalUrl,
            ogImage: dto.ogImage || dto.coverImage || existing.coverImage,
          },
          update: {
            metaTitle: dto.metaTitle ?? undefined,
            metaDescription: dto.metaDescription ?? undefined,
            keywords: dto.keywords ?? undefined,
            canonicalUrl: dto.canonicalUrl ?? undefined,
            ogImage: dto.ogImage ?? undefined,
          },
        });
      }

      // Save revision if content or title changed
      if (dto.content || dto.title || blockContentValue !== undefined) {
        await tx.blogRevision.create({
          data: {
            blogId: id,
            revisionNum: lastRevNum + 1,
            title: dto.title || existing.title,
            subtitle: dto.subtitle || existing.subtitle,
            excerpt: dto.excerpt || existing.excerpt,
            content: dto.content || existing.content,
            ...(blockContentValue !== undefined ? { blockContent: blockContentValue } : {}),
            createdBy: userId,
          },
        });
      }
    });

    await this.invalidateCache();
    return this.getAdminBlogById(id);
  }

  async rollbackRevision(blogId: string, revisionId: string, userId?: string) {
    const revision = await this.prisma.prisma.blogRevision.findUnique({
      where: { id: revisionId },
    });
    if (!revision || revision.blogId !== blogId) {
      throw new NotFoundException('Revision history entry not found');
    }

    return this.updateBlog(
      blogId,
      {
        title: revision.title,
        subtitle: revision.subtitle || undefined,
        excerpt: revision.excerpt || undefined,
        content: revision.content,
        // Restore blockContent from the revision if it exists
        ...((revision as any).blockContent ? { blockContent: (revision as any).blockContent } : {}),
      } as any,
      userId,
    );
  }

  async deleteBlog(id: string) {
    const existing = await this.prisma.prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog article not found');

    await this.prisma.prisma.blog.delete({ where: { id } });
    await this.invalidateCache();
    return { success: true, message: 'Blog article deleted successfully' };
  }

  async duplicateBlog(id: string, authorId?: string) {
    const existing = await this.getAdminBlogById(id);
    const newTitle = `${existing.title} (Copy)`;

    return this.createBlog(
      {
        title: newTitle,
        subtitle: existing.subtitle || undefined,
        excerpt: existing.excerpt || undefined,
        content: existing.content,
        // Carry over BlockNote rich content to the duplicate
        ...((existing as any).blockContent ? { blockContent: (existing as any).blockContent } : {}),
        status: BlogStatusEnum.DRAFT,
        coverImage: existing.coverImage || undefined,
        heroImage: existing.heroImage || undefined,
        categoryIds: existing.categories.map((c: any) => c.id),
        tagIds: existing.tags.map((t: any) => t.id),
      } as any,
      authorId,
    );
  }

  async bulkUpdateStatus(ids: string[], status: BlogStatusEnum) {
    await this.prisma.prisma.blog.updateMany({
      where: { id: { in: ids } },
      data: {
        status: status as any,
        publishedAt: status === BlogStatusEnum.PUBLISHED ? new Date() : undefined,
      },
    });
    await this.invalidateCache();
    return { success: true, count: ids.length };
  }

  async bulkDelete(ids: string[]) {
    await this.prisma.prisma.blog.deleteMany({
      where: { id: { in: ids } },
    });
    await this.invalidateCache();
    return { success: true, count: ids.length };
  }
}
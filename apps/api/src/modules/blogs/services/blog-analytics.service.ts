import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BlogAnalyticsService {
  constructor(private readonly prisma: PrismaService) { }

  async getDashboardAnalytics() {
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      scheduledBlogs,
      totalViews,
      totalLikes,
      topCategories,
      topArticles,
      recentViews,
    ] = await Promise.all([
      this.prisma.prisma.blog.count(),
      this.prisma.prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.prisma.blog.count({ where: { status: 'DRAFT' } }),
      this.prisma.prisma.blog.count({ where: { status: 'SCHEDULED' } }),
      this.prisma.prisma.blog.aggregate({ _sum: { viewsCount: true } }),
      this.prisma.prisma.blog.aggregate({ _sum: { likesCount: true } }),
      this.prisma.prisma.blogCategory.findMany({
        take: 5,
        include: {
          _count: { select: { blogs: true } },
        },
        orderBy: { blogs: { _count: 'desc' } },
      }),
      this.prisma.prisma.blog.findMany({
        where: { status: 'PUBLISHED' },
        take: 5,
        orderBy: { viewsCount: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          viewsCount: true,
          likesCount: true,
          publishedAt: true,
        },
      }),
      this.prisma.prisma.blogViewHistory.findMany({
        take: 10,
        orderBy: { viewedAt: 'desc' },
        include: {
          blog: {
            select: { title: true, slug: true },
          },
        },
      }),
    ]);

    return {
      overview: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        scheduledBlogs,
        totalViews: totalViews._sum.viewsCount || 0,
        totalLikes: totalLikes._sum.likesCount || 0,
      },
      topCategories: topCategories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.blogs,
      })),
      topArticles,
      recentViews,
    };
  }

  async recordView(blogId: string, ipAddress?: string, userAgent?: string, referrer?: string) {
    // 1. Increment blog views count
    await this.prisma.prisma.blog.update({
      where: { id: blogId },
      data: {
        viewsCount: { increment: 1 },
      },
    });

    // 2. Add entry to ViewHistory table
    await this.prisma.prisma.blogViewHistory.create({
      data: {
        blogId,
        ipAddress: ipAddress || '127.0.0.1',
        userAgent: userAgent || 'Browser',
        referrer: referrer || 'Direct',
      },
    });

    return { success: true };
  }

  async recordLike(blogId: string) {
    const updated = await this.prisma.prisma.blog.update({
      where: { id: blogId },
      data: {
        likesCount: { increment: 1 },
      },
      select: { likesCount: true },
    });
    return updated;
  }
}

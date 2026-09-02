import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/category-tag.dto';

@Injectable()
export class BlogCategoryService {
  constructor(private readonly prisma: PrismaService) { }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  async getAllCategories() {
    const categories = await this.prisma.prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { blogs: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((cat: any) => ({
      ...cat,
      blogsCount: cat._count.blogs,
    }));
  }

  async getCategoryBySlug(slug: string) {
    const cat = await this.prisma.prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { blogs: true },
        },
      },
    });
    if (!cat) throw new NotFoundException(`Category '${slug}' not found`);
    return { ...cat, blogsCount: cat._count.blogs };
  }

  async createCategory(dto: CreateCategoryDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);
    const existing = await this.prisma.prisma.blogCategory.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Category with slug '${slug}' already exists`);
    }

    return this.prisma.prisma.blogCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        color: dto.color || '#072460',
        coverImage: dto.coverImage,
      },
    });
  }

  async updateCategory(id: string, dto: Partial<CreateCategoryDto>) {
    const existing = await this.prisma.prisma.blogCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Category not found`);

    let slug = existing.slug;
    if (dto.slug || dto.name) {
      slug = this.slugify(dto.slug || dto.name || existing.name);
    }

    return this.prisma.prisma.blogCategory.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        slug,
        description: dto.description ?? existing.description,
        color: dto.color ?? existing.color,
        coverImage: dto.coverImage ?? existing.coverImage,
      },
    });
  }

  async deleteCategory(id: string) {
    const existing = await this.prisma.prisma.blogCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Category not found`);

    return this.prisma.prisma.blogCategory.delete({ where: { id } });
  }
}

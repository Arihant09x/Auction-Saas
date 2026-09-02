import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTagDto } from '../dto/category-tag.dto';

@Injectable()
export class BlogTagService {
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

  async getAllTags() {
    const tags = await this.prisma.prisma.blogTag.findMany({
      include: {
        _count: {
          select: { blogs: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tags.map((tag: any) => ({
      ...tag,
      blogsCount: tag._count.blogs,
    }));
  }

  async getTagBySlug(slug: string) {
    const tag = await this.prisma.prisma.blogTag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { blogs: true },
        },
      },
    });
    if (!tag) throw new NotFoundException(`Tag '${slug}' not found`);
    return { ...tag, blogsCount: tag._count.blogs };
  }

  async createTag(dto: CreateTagDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);
    const existing = await this.prisma.prisma.blogTag.findUnique({ where: { slug } });
    if (existing) {
      return existing; // Return existing tag cleanly
    }

    return this.prisma.prisma.blogTag.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
      },
    });
  }

  async findOrCreateTagsByName(tagNames: string[]) {
    const createdTags = [];
    for (const name of tagNames) {
      if (!name || !name.trim()) continue;
      const slug = this.slugify(name);
      let tag = await this.prisma.prisma.blogTag.findUnique({ where: { slug } });
      if (!tag) {
        tag = await this.prisma.prisma.blogTag.create({
          data: { name: name.trim(), slug },
        });
      }
      createdTags.push(tag);
    }
    return createdTags;
  }

  async updateTag(id: string, dto: Partial<CreateTagDto>) {
    const existing = await this.prisma.prisma.blogTag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Tag not found`);

    let slug = existing.slug;
    if (dto.slug || dto.name) {
      slug = this.slugify(dto.slug || dto.name || existing.name);
    }

    return this.prisma.prisma.blogTag.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        slug,
        description: dto.description ?? existing.description,
      },
    });
  }

  async deleteTag(id: string) {
    const existing = await this.prisma.prisma.blogTag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Tag not found`);

    return this.prisma.prisma.blogTag.delete({ where: { id } });
  }
}

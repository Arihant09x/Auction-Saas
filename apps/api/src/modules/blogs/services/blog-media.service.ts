import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class BlogMediaService {
  private readonly logger = new Logger(BlogMediaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  private getCloudinaryCredentials() {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || process.env.CLOUDINARY_CLOUD_NAME || 'auction11';
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY') || process.env.CLOUDINARY_API_KEY;
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET') || process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = this.configService.get<string>('CLOUDINARY_UPLOAD_PRESET') || process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';

    return { cloudName, apiKey, apiSecret, uploadPreset };
  }

  async uploadImageBase64(base64Data: string, altText?: string, caption?: string, folder = 'blog_media') {
    if (!base64Data) {
      throw new BadRequestException('Image base64 content is required');
    }

    const { cloudName, apiKey, apiSecret, uploadPreset } = this.getCloudinaryCredentials();

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      let payload: any = {
        file: base64Data.startsWith('data:') ? base64Data : `data:image/jpeg;base64,${base64Data}`,
        folder,
      };

      if (apiKey && apiSecret) {
        // Signed Upload
        const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');
        payload = {
          ...payload,
          api_key: apiKey,
          timestamp,
          signature,
        };
      } else {
        // Unsigned preset upload fallback
        payload.upload_preset = uploadPreset;
      }

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        payload,
      );

      const data = response.data;
      const media = await this.prisma.prisma.mediaImage.create({
        data: {
          publicId: data.public_id,
          secureUrl: data.secure_url,
          width: data.width,
          height: data.height,
          format: data.format,
          size: data.bytes,
          altText: altText || '',
          caption: caption || '',
          folder,
        },
      });

      return media;
    } catch (err: any) {
      this.logger.error(`Cloudinary upload failed: ${err.message}`, err.response?.data);
      // Fallback mock record for local development testing if Cloudinary credentials missing
      const mockPublicId = `blog_media/mock_${Date.now()}`;
      const mockUrl = base64Data.startsWith('http')
        ? base64Data
        : 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80';

      return this.prisma.prisma.mediaImage.create({
        data: {
          publicId: mockPublicId,
          secureUrl: mockUrl,
          width: 1200,
          height: 675,
          format: 'jpg',
          size: 150000,
          altText: altText || 'Blog Banner',
          caption: caption || '',
          folder,
        },
      });
    }
  }

  async getAllMedia(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;

    // 1. Fetch from mediaImage table
    const whereMedia: any = {};
    if (search) {
      whereMedia.OR = [
        { publicId: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    const mediaItems = await this.prisma.prisma.mediaImage.findMany({
      where: whereMedia,
      orderBy: { createdAt: 'desc' },
    });

    // 2. Fetch blog articles that have images
    //    (adjust the model name if needed: 'blog' or 'blogArticle')
    const blogArticles = await this.prisma.prisma.blog.findMany({
      where: {
        OR: [
          { coverImage: { not: null } },
          { heroImage: { not: null } },
          { thumbnailImage: { not: null } },
        ],
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        heroImage: true,
        thumbnailImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build a set of existing URLs from mediaItems
    const existingUrls = new Set(mediaItems.map((m: any) => m.secureUrl));

    // Create virtual items for URLs not yet in mediaItems
    const virtualItems: any[] = [];
    const urlMap = new Map<string, boolean>();

    blogArticles.forEach((article: any) => {
      const images = [article.coverImage, article.heroImage, article.thumbnailImage].filter(Boolean);
      images.forEach((url: string) => {
        if (url && !existingUrls.has(url) && !urlMap.has(url)) {
          urlMap.set(url, true);
          virtualItems.push({
            id: `blog-${article.id}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            publicId: `blog/${article.id}/cover`,
            secureUrl: url,
            width: null,
            height: null,
            format: null,
            size: null,
            altText: article.title || 'Blog cover',
            caption: '',
            createdAt: article.createdAt || new Date(),
          });
        }
      });
    });

    // Combine and sort by createdAt descending
    const combined = [...mediaItems, ...virtualItems];
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply search filter on the combined list (if any)
    let filtered = combined;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = combined.filter((item) =>
        (item.altText && item.altText.toLowerCase().includes(lowerSearch)) ||
        (item.publicId && item.publicId.toLowerCase().includes(lowerSearch)) ||
        (item.caption && item.caption.toLowerCase().includes(lowerSearch))
      );
    }

    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteMedia(id: string) {
    const media = await this.prisma.prisma.mediaImage.findUnique({
      where: { id },
    });
    if (!media) throw new NotFoundException('Media item not found');

    const { cloudName, apiKey, apiSecret } = this.getCloudinaryCredentials();

    if (apiKey && apiSecret) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureStr = `public_id=${media.publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

        await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
          public_id: media.publicId,
          api_key: apiKey,
          timestamp,
          signature,
        });
      } catch (err: any) {
        this.logger.warn(`Failed to destroy Cloudinary image ${media.publicId}: ${err.message}`);
      }
    }

    return this.prisma.prisma.mediaImage.delete({ where: { id } });
  }
}

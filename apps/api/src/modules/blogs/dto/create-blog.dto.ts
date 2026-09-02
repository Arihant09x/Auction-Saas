import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsDateString, IsInt, Min } from 'class-validator';

export enum BlogStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateBlogDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  blockContent?: any[];

  @IsEnum(BlogStatusEnum)
  @IsOptional()
  status?: BlogStatusEnum;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  thumbnailImage?: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @IsBoolean()
  @IsOptional()
  allowComments?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[]; // For dynamically creating & linking tags

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  // SEO metadata
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsString()
  @IsOptional()
  canonicalUrl?: string;

  @IsString()
  @IsOptional()
  ogImage?: string;
}

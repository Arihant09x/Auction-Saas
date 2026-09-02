import { IsOptional, IsString, IsInt, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { BlogStatusEnum } from './create-blog.dto';

export class QueryBlogDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string; // Category slug or ID

  @IsOptional()
  @IsString()
  tag?: string; // Tag slug or ID

  @IsOptional()
  @IsEnum(BlogStatusEnum)
  status?: BlogStatusEnum;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'publishedAt' | 'viewsCount' | 'title' = 'publishedAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  featuredOnly?: string; // 'true' / 'false'

  @IsOptional()
  @IsString()
  trendingOnly?: string; // 'true' / 'false'
}

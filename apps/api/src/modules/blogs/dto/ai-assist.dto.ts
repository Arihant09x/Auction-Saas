import { IsString, IsOptional } from 'class-validator';

export class AiGenerateDraftDto {
  @IsString()
  topic!: string;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsString()
  @IsOptional()
  tone?: string;

  @IsString()
  @IsOptional()
  keywords?: string;
}

export class AiSeoSuggestDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;
}

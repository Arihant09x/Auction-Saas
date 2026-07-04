import { Injectable, Inject, Logger } from '@nestjs/common';
import { REDIS_CLIENT } from '../../redis/redis.provider';
import Redis from 'ioredis';
import axios from 'axios';
import * as crypto from 'crypto';

export interface BlogArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  publishedAt: string;
}

const REDIS_CACHE_KEY = 'cricket_blogs_cache';
const REDIS_BACKUP_KEY = 'cricket_blogs_cache_backup';
const CACHE_TTL_SECONDS = 3600; // 60 minutes

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  private readonly fallbackArticles: BlogArticle[] = [
    {
      id: "fallback-1",
      title: "IPL Season Highlights: Dramatic Finish Caps Off a Thrilling Tournament",
      description: "The Indian Premier League concludes with spectacular performances, breaking viewership records and showcasing extraordinary talent from around the globe.",
      imageUrl: "/images/cricket-placeholder.jpg",
      url: "https://www.iplt20.com",
      publishedAt: new Date().toISOString()
    },
    {
      id: "fallback-2",
      title: "World Cup Preparations Intensify: Teams Announce Final Squads",
      description: "National selectors make bold calls as countries lock in their 15-player squads for the upcoming ICC World Cup event. Net practices are in full swing.",
      imageUrl: "/images/cricket-placeholder.jpg",
      url: "https://www.icc-cricket.com",
      publishedAt: new Date().toISOString()
    },
    {
      id: "fallback-3",
      title: "The Evolution of Modern Cricket: Analytics and Tech Reshaping the Game",
      description: "How artificial intelligence, advanced wearable sensors, and real-time data tracking are revolutionizing coaching strategies, player safety, and spectator experience.",
      imageUrl: "/images/cricket-placeholder.jpg",
      url: "https://www.espncricinfo.com",
      publishedAt: new Date().toISOString()
    }
  ];

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  async getBlogs(page: number, limit: number) {
    let articles: BlogArticle[] = [];

    try {
      // 1. Try to fetch from Redis Cache
      const cachedData = await this.redis.get(REDIS_CACHE_KEY);
      if (cachedData) {
        articles = JSON.parse(cachedData);
        this.logger.log('Serving blogs directly from Redis active cache');
      }
    } catch (err: any) {
      this.logger.error(`Redis read error: ${err.message}`);
    }

    // 2. Cache Miss or empty -> Fetch from External API
    if (articles.length === 0) {
      this.logger.log('Redis cache miss. Fetching from external News API...');
      try {
        articles = await this.fetchFromExternalApi();
        
        // 3. Cache the successful result in Redis
        if (articles.length > 0) {
          try {
            await this.redis.setex(REDIS_CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(articles));
            // Keep a persistent backup in case the API is down in the future
            await this.redis.set(REDIS_BACKUP_KEY, JSON.stringify(articles));
            this.logger.log('Successfully cached fresh articles in Redis');
          } catch (redisError: any) {
            this.logger.error(`Failed to write to Redis: ${redisError.message}`);
          }
        }
      } catch (apiError: any) {
        this.logger.error(`External news API call failed: ${apiError.message}`);
        
        // 4. API Down Fallback: Try to use backup cache first
        try {
          const backupData = await this.redis.get(REDIS_BACKUP_KEY);
          if (backupData) {
            articles = JSON.parse(backupData);
            this.logger.warn('External API failed. Serving stale articles from backup Redis cache');
          }
        } catch (redisBackupError: any) {
          this.logger.error(`Failed to read from backup Redis cache: ${redisBackupError.message}`);
        }

        // 5. Hard Fallback: If both API and Redis are empty, return generic fallback items
        if (articles.length === 0) {
          this.logger.warn('API down and Redis is empty. Serving static generic fallback articles');
          articles = this.fallbackArticles;
        }
      }
    }

    // 6. Paginate result
    const total = articles.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = articles.slice(start, end);

    return {
      data: paginated,
      meta: {
        total,
        page,
        limit,
      }
    };
  }

  private async fetchFromExternalApi(): Promise<BlogArticle[]> {
    const gnewsKey = process.env.GNEWS_API_KEY;
    const newsapiKey = process.env.NEWS_API_KEY;

    let responseData: any = null;
    let apiUsed = '';

    const axiosInstance = axios.create({
      timeout: 8000, // 8 seconds timeout
    });

    // Waterfall Fallback Logic
    // 1. Try GNews first
    if (gnewsKey) {
      try {
        this.logger.log('Attempting GNews API for cricket articles...');
        const url = `https://gnews.io/api/v4/search?q=cricket+OR+IPL&lang=en&token=${gnewsKey}`;
        const response = await axiosInstance.get(url);
        responseData = response.data;
        apiUsed = 'gnews';
      } catch (err: any) {
        this.logger.error(`GNews API failed: ${err.message || err}. Moving down the waterfall...`);
      }
    }

    // 2. Try NewsAPI second if GNews failed or was not configured
    if (!responseData && newsapiKey) {
      try {
        this.logger.log('Attempting NewsAPI for cricket articles...');
        const url = `https://newsapi.org/v2/everything?q=cricket+OR+IPL&language=en&sortBy=publishedAt&apiKey=${newsapiKey}`;
        const response = await axiosInstance.get(url);
        responseData = response.data;
        apiUsed = 'newsapi';
      } catch (err: any) {
        this.logger.error(`NewsAPI failed: ${err.message || err}. Moving down the waterfall...`);
      }
    }

    // 3. Fall back to Saurav.tech free mirror if both failed or were not configured
    if (!responseData) {
      try {
        this.logger.log('Using public free Saurav.tech sports news mirror...');
        const url = 'https://saurav.tech/NewsAPI/top-headlines/category/sports/in.json';
        const response = await axiosInstance.get(url);
        responseData = response.data;
        apiUsed = 'saurav';
      } catch (err: any) {
        this.logger.error(`Saurav.tech mirror failed: ${err.message || err}`);
        throw new Error('All external news API sources in the waterfall have failed.');
      }
    }

    if (!responseData) {
      throw new Error('Failed to retrieve news from any source');
    }

    let rawArticles: any[] = [];
    if (apiUsed === 'gnews') {
      rawArticles = responseData.articles || [];
    } else if (apiUsed === 'newsapi' || apiUsed === 'saurav') {
      rawArticles = responseData.articles || [];
    }

    // Filter, Map and Deduplicate articles
    const mapped: BlogArticle[] = [];
    const seenUrls = new Set<string>();
    const seenTitles = new Set<string>();
    
    for (const item of rawArticles) {
      const url = item.url || '';
      const title = item.title || '';
      const description = item.description || item.content || '';
      
      const normalizedUrl = url.trim().toLowerCase();
      const normalizedTitle = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

      if (!normalizedUrl || seenUrls.has(normalizedUrl) || (normalizedTitle && seenTitles.has(normalizedTitle))) {
        continue;
      }

      // If we are using Saurav.tech sports in.json, filter specifically for cricket or IPL to ensure relevance
      if (apiUsed === 'saurav') {
        const isCricketRelated = /cricket|ipl|wpl|match|wicket|dhoni|kohli|rohit|t20|bcci/i.test(title + ' ' + description);
        if (!isCricketRelated) {
          continue; // skip irrelevant sports news
        }
      }

      seenUrls.add(normalizedUrl);
      if (normalizedTitle) {
        seenTitles.add(normalizedTitle);
      }

      // Safe stable ID using MD5 hash of url
      const hash = crypto.createHash('md5').update(normalizedUrl).digest('hex');
      
      mapped.push({
        id: hash,
        title: title,
        description: description,
        imageUrl: item.urlToImage || item.image || '/images/cricket-placeholder.jpg',
        url: url,
        publishedAt: item.publishedAt || new Date().toISOString()
      });
    }

    return mapped;
  }
}

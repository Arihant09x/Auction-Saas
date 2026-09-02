import { Injectable, Logger } from '@nestjs/common';
import { AiGenerateDraftDto, AiSeoSuggestDto } from '../dto/ai-assist.dto';

@Injectable()
export class BlogAiService {
  private readonly logger = new Logger(BlogAiService.name);

  async generateDraft(dto: AiGenerateDraftDto) {
    this.logger.log(`Generating AI blog draft for topic: ${dto.topic}`);

    const topic = dto.topic.trim();
    const tone = dto.tone || 'engaging and informative';
    const audience = dto.targetAudience || 'sports organizers, teams, and fans';
    const keywords = dto.keywords ? dto.keywords.split(',').map((k) => k.trim()) : ['sports auction', 'Auction11', 'event management'];

    const title = `The Ultimate Guide to ${topic}: Strategies & Best Practices for 2026`;
    const subtitle = `Discover how modern digital tools and proven techniques are transforming ${topic.toLowerCase()} for ${audience}.`;
    const excerpt = `Mastering ${topic.toLowerCase()} requires strategic planning, real-time analytics, and seamless coordination. Here is everything you need to know to achieve top-tier results.`;

    const content = `# ${title}

> *A comprehensive breakdown written for ${audience} in a ${tone} tone.*

## Introduction

Organizing and managing high-stakes sporting events and auctions is evolving rapidly. Whether you are running a local cricket league or an enterprise-scale tournament, **${topic}** plays a pivotal role in ensuring fairness, excitement, and overall commercial success.

In this guide, we dive deep into the essential steps, modern technological innovations, and actionable takeaways that will elevate your organization to industry-leading standards.

---

## 1. Why ${topic} Matters More Than Ever

In today's fast-paced sports ecosystem, transparency and efficiency dictate user trust. Key benefits include:

* **Real-time Synchronization:** Eliminating manual record-keeping errors.
* **Enhanced Fan Engagement:** Keeping audience members glued to live leaderboards and overlay feeds.
* **Budget Optimization:** Maximizing team purse utilization while maintaining strict fair-play rules.

> "The combination of real-time data streaming and automated bid validation turns complex auctions into thrilling spectacles." — *Auction11 Engineering Team*

---

## 2. Core Strategies for Executing ${topic} Successfully

### Step A: Preparation and Data Verification
Before launching your live event, verify player databases, category distributions, and purse caps:

\`\`\`json
{
  "event": "${topic}",
  "status": "READY",
  "features": ["Live Overlay", "Cloud Analytics", "Instant Sync"]
}
\`\`\`

### Step B: Leveraging Live Overlay Controls
Connecting live stream feeds via OBS or browser sources ensures broadcast-quality visuals for spectators across all mobile and desktop screens.

---

## 3. Key Takeaways and Best Practices

1. **Test Infrastructure Early:** Run dry-runs prior to official bidding rounds.
2. **Utilize Automated Boosters:** Set reserve rules and auto-increments to maintain high momentum.
3. **Analyze Post-Event Insights:** Leverage export tools to review budget allocations and roster stats.

## Conclusion

By adopting these modern principles for **${topic}**, team managers and organizers can deliver an unmatched experience. Stay tuned for more insights and updates from **Auction11**!
`;

    return {
      title,
      subtitle,
      excerpt,
      content,
      suggestedKeywords: keywords.join(', '),
    };
  }

  async suggestSeo(dto: AiSeoSuggestDto) {
    const cleanTitle = dto.title.replace(/[^\w\s]/gi, '').trim();
    const metaTitle = `${cleanTitle.slice(0, 50)} | Auction11 Blog`;
    
    // Extract first 150 chars from content or build default description
    const cleanContent = dto.content.replace(/#|\*|`|>|-/g, '').replace(/\s+/g, ' ').trim();
    const metaDescription = cleanContent.length > 150 
      ? `${cleanContent.slice(0, 147)}...` 
      : cleanContent || `Learn all about ${cleanTitle} on Auction11 official blog platform.`;

    const words = cleanContent.toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    words.forEach((w) => {
      if (w.length > 4 && !['about', 'their', 'there', 'which', 'would', 'could', 'these'].includes(w)) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word);

    return {
      metaTitle,
      metaDescription,
      keywords: topKeywords.length > 0 ? topKeywords.join(', ') : 'auction11, sports auction, live bidding',
    };
  }

  async summarizeContent(content: string) {
    const clean = content.replace(/#|\*|`|>|-/g, '').replace(/\s+/g, ' ').trim();
    const sentences = clean.split(/(?<=[.!?])\s+/);
    const summary = sentences.slice(0, 2).join(' ');
    return {
      summary: summary || 'A detailed article covering best practices and insights on Auction11.',
    };
  }
}

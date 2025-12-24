// Bangumi API 服务

import { UserCollection, BangumiSubject, CollectionType, BangumiStats } from '@/types/bangumi';

const BASE_URL = 'https://api.bgm.tv';

export interface FetchCollectionsOptions {
  userId: string;
  subjectType?: number; // 2 = anime
  type?: CollectionType;
  limit?: number;
  offset?: number;
}

export async function fetchUserCollections(options: FetchCollectionsOptions): Promise<UserCollection[]> {
  const { userId, subjectType = 2, type, limit = 50, offset = 0 } = options;

  const params = new URLSearchParams({
    subject_type: String(subjectType),
    limit: String(limit),
    offset: String(offset),
  });

  if (type) {
    params.set('type', String(type));
  }

  const url = `${BASE_URL}/v0/users/${userId}/collections?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'BangumiTracker/1.0',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch collections: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

export async function fetchAllUserCollections(userId: string): Promise<UserCollection[]> {
  const allCollections: UserCollection[] = [];
  let offset = 0;
  const limit = 50;
  let hasMore = true;

  while (hasMore) {
    const collections = await fetchUserCollections({
      userId,
      limit,
      offset,
    });

    if (collections.length === 0) {
      hasMore = false;
    } else {
      allCollections.push(...collections);
      offset += limit;
      
      // Rate limiting - wait 200ms between requests
      if (collections.length === limit) {
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        hasMore = false;
      }
    }
  }

  return allCollections;
}

export async function fetchSubjectDetails(subjectId: number): Promise<BangumiSubject> {
  const response = await fetch(`${BASE_URL}/v0/subjects/${subjectId}`, {
    headers: {
      'User-Agent': 'BangumiTracker/1.0',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch subject: ${response.status}`);
  }

  return response.json();
}

export function calculateStats(collections: UserCollection[]): BangumiStats {
  const byType: Record<CollectionType, number> = {
    [CollectionType.WISH]: 0,
    [CollectionType.COLLECT]: 0,
    [CollectionType.DOING]: 0,
    [CollectionType.ON_HOLD]: 0,
    [CollectionType.DROPPED]: 0,
  };

  const byYear: Record<string, number> = {};
  let totalRating = 0;
  let ratedCount = 0;

  collections.forEach(collection => {
    byType[collection.type]++;

    const airDate = collection.subject.air_date;
    if (airDate) {
      const year = airDate.split('-')[0];
      byYear[year] = (byYear[year] || 0) + 1;
    }

    if (collection.rate && collection.rate > 0) {
      totalRating += collection.rate;
      ratedCount++;
    }
  });

  const topRated = [...collections]
    .filter(c => c.rate && c.rate > 0)
    .sort((a, b) => (b.rate || 0) - (a.rate || 0))
    .slice(0, 10);

  return {
    total: collections.length,
    byType,
    byYear,
    averageRating: ratedCount > 0 ? totalRating / ratedCount : 0,
    topRated,
  };
}

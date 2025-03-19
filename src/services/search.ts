import { AUTH_CONFIG } from '@/config/auth';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'issue' | 'service';
  url: string;
  confidence: number;
}

export const searchService = {
  async search(query: string, accessToken: string): Promise<SearchResult[]> {
    try {
      // Search across Jira issues
      const jiraResponse = await fetch(
        `https://api.atlassian.com/ex/jira/${AUTH_CONFIG.cloudId}/rest/api/3/search?jql=summary~"${query}" OR description~"${query}"`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Search across Confluence pages
      const confluenceResponse = await fetch(
        `https://api.atlassian.com/wiki/rest/api/content/search?cql=type=page AND (title~"${query}" OR text~"${query}")`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!jiraResponse.ok || !confluenceResponse.ok) {
        throw new Error('Failed to fetch search results');
      }

      const [jiraData, confluenceData] = await Promise.all([
        jiraResponse.json(),
        confluenceResponse.json(),
      ]);

      // Transform Jira issues
      const jiraResults: SearchResult[] = jiraData.issues.map((issue: any) => ({
        id: issue.id,
        title: issue.fields.summary,
        content: issue.fields.description || '',
        type: 'issue',
        url: `${AUTH_CONFIG.cloudUrl}/browse/${issue.key}`,
        confidence: 0.8,
      }));

      // Transform Confluence pages
      const confluenceResults: SearchResult[] = confluenceData.results.map(
        (page: any) => ({
          id: page.id,
          title: page.title,
          content: page.excerpt,
          type: 'article',
          url: `${AUTH_CONFIG.cloudUrl}/wiki/spaces/${page.space.key}/pages/${page.id}`,
          confidence: 0.7,
        })
      );

      // Combine and sort results by confidence
      return [...jiraResults, ...confluenceResults].sort(
        (a, b) => b.confidence - a.confidence
      );
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },
}; 
export const AUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID || '',
  clientSecret: process.env.ATLASSIAN_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_ATLASSIAN_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  scopes: [
    'read:jira-work',
    'write:jira-work',
    'read:jira-user',
    'read:confluence-content',
    'write:confluence-content',
    'read:confluence-space',
    'read:confluence-user',
  ].join(' '),
  authUrl: 'https://auth.atlassian.com/authorize',
  tokenUrl: 'https://auth.atlassian.com/oauth/token',
  userInfoUrl: 'https://api.atlassian.com/oauth/token/accessible-resources',
  cloudUrl: process.env.NEXT_PUBLIC_ATLASSIAN_CLOUD_URL || 'https://your-domain.atlassian.net',
}; 
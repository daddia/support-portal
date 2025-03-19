'use client';

import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Article as ArticleIcon,
  BugReport as IssueIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'issue' | 'service';
  url: string;
  confidence: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

const getResultIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'article':
      return <ArticleIcon color="primary" />;
    case 'issue':
      return <IssueIcon color="error" />;
    case 'service':
      return <HelpIcon color="success" />;
    default:
      return <ArticleIcon />;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  query,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!query) {
    return null;
  }

  if (results.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No results found for "{query}"
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mt: 2 }}>
      <List>
        {results.map((result, index) => (
          <React.Fragment key={result.id}>
            {index > 0 && <Divider />}
            <ListItem
              component={Link}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>{getResultIcon(result.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'medium' }}
                  >
                    {result.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {result.content}
                  </Typography>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default SearchResults; 
import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { urlFor } from '@/lib/sanity';
import PortableText from './PortableText';
import { KnowledgeBaseArticle } from '@/services/sanity';

interface ArticleProps {
  article: KnowledgeBaseArticle;
}

export default function Article({ article }: ArticleProps) {
  const authorImage = article.author?.image
    ? urlFor(article.author.image).url()
    : undefined;

  return (
    <Paper sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {article.title}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src={authorImage}
            alt={article.author?.name}
            sx={{ width: 40, height: 40 }}
          >
            {article.author?.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">{article.author?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(article.publishedAt).toLocaleDateString()}
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <> • Updated {new Date(article.updatedAt).toLocaleDateString()}</>
              )}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={article.category?.name}
            color="primary"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          {article.tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />
      </Box>

      <Box sx={{ typography: 'body1' }}>
        <PortableText value={article.content} />
      </Box>
    </Paper>
  );
} 
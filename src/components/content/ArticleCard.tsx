import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import { urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { KnowledgeBaseArticle } from '@/services/sanity';

interface ArticleCardProps {
  article: KnowledgeBaseArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const authorImage = article.author?.image
    ? urlFor(article.author.image).url()
    : undefined;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/knowledge/${article.slug.current}`}
        sx={{ flex: 1 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {article.title}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Chip
              label={article.category?.name}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            {article.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={authorImage}
              alt={article.author?.name}
              sx={{ width: 24, height: 24 }}
            >
              {article.author?.name?.[0]}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {article.author?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(article.publishedAt).toLocaleDateString()}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
} 
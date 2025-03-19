import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import Link from 'next/link';
import { Category } from '@/services/sanity';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/knowledge/category/${category.slug.current}`}
        sx={{ flex: 1 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {category.name}
          </Typography>
          {category.description && (
            <Typography variant="body2" color="text.secondary">
              {category.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
} 
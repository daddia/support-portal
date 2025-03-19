'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  HelpOutline,
  Search,
  BugReport,
  Assignment,
  Search as SearchIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import { searchService } from '@/services/search';
import SearchResults from '@/components/search/SearchResults';
import LoadingState from '@/components/common/LoadingState';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface FrontPage {
  title: string;
  description: string;
  heroImage: {
    asset: {
      url: string;
    };
    alt: string;
  };
  featuredArticles: Array<{
    title: string;
    slug: string;
    publishedAt: string;
    author: {
      name: string;
    };
  }>;
  categories: Array<{
    title: string;
    slug: string;
    description: string;
  }>;
}

interface HomePageProps {
  frontPage: FrontPage;
}

export default function HomePage({ frontPage }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    '/': (event) => {
      event.preventDefault();
      searchInputRef.current?.focus();
    },
    'escape': () => {
      setSearchQuery('');
      setSearchResults([]);
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !user?.accessToken) {
      showToast('Please enter a search term', 'warning');
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchService.search(searchQuery, user.accessToken);
      setSearchResults(results);
      if (results.length === 0) {
        showToast('No results found', 'info');
      }
    } catch (error) {
      console.error('Search failed:', error);
      showToast('Search failed. Please try again.', 'error');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 4, sm: 8 },
          mb: 6,
          background: (theme) =>
            `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {frontPage.heroImage && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              opacity: 0.2,
            }}
          >
            <Image
              src={frontPage.heroImage.asset.url}
              alt={frontPage.heroImage.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>
        )}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant={isMobile ? 'h2' : 'h1'}
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}
          >
            {frontPage.title}
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
          >
            {frontPage.description}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              px: 2,
            }}
          >
            <TextField
              inputRef={searchInputRef}
              fullWidth
              variant="outlined"
              placeholder="Tell us what you are looking for... (Press '/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      disabled={isSearching || !user?.accessToken}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 82, 204, 0.04)',
                        },
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Search Results */}
      {isSearching ? (
        <LoadingState showSkeleton={true} skeletonCount={3} />
      ) : (
        <SearchResults
          results={searchResults}
          isLoading={isSearching}
          query={searchQuery}
        />
      )}

      {/* Featured Articles */}
      {frontPage.featuredArticles && frontPage.featuredArticles.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Featured Articles
          </Typography>
          <Grid container spacing={4}>
            {frontPage.featuredArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.slug}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/knowledge/${article.slug}`}
                    sx={{ flex: 1 }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By {article.author.name} •{' '}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Categories */}
      {frontPage.categories && frontPage.categories.length > 0 && (
        <Box>
          <Typography variant="h4" gutterBottom>
            Browse by Category
          </Typography>
          <Grid container spacing={4}>
            {frontPage.categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.slug}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/category/${category.slug}`}
                    sx={{ flex: 1 }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
} 
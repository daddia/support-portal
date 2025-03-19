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
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import { searchService } from '@/services/search';
import SearchResults from '@/components/search/SearchResults';
import LoadingState from '@/components/common/LoadingState';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const features = [
  {
    title: 'Knowledge Base',
    description: 'Search through our comprehensive knowledge base for answers to common questions.',
    icon: <Search sx={{ fontSize: 40 }} />,
    link: '/knowledge',
  },
  {
    title: 'Report an Issue',
    description: 'Submit a ticket for technical issues or bugs you encounter.',
    icon: <BugReport sx={{ fontSize: 40 }} />,
    link: '/report-issue',
  },
  {
    title: 'Service Requests',
    description: 'Request new services or modifications to existing ones.',
    icon: <Assignment sx={{ fontSize: 40 }} />,
    link: '/service-request',
  },
  {
    title: 'Get Help',
    description: 'Contact our support team for personalized assistance.',
    icon: <HelpOutline sx={{ fontSize: 40 }} />,
    link: '/help',
  },
];

export default function Home() {
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
        }}
      >
        <Typography
          variant={isMobile ? 'h2' : 'h1'}
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}
        >
          How can we help?
        </Typography>
        <Typography
          variant="h5"
          sx={{ mb: 4, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
        >
          Find answers via Tempster knowledge base
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

      {/* Features Grid */}
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
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
                href={feature.link}
                sx={{ flex: 1 }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h6" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

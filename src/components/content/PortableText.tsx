import { PortableText as PortableTextComponent } from '@portabletext/react';
import { Typography, Box, Link } from '@mui/material';
import { urlFor } from '@/lib/sanity';
import Image from 'next/image';

interface PortableTextProps {
  value: any;
}

const components = {
  block: {
    h1: ({ children }: any) => (
      <Typography variant="h1" gutterBottom>
        {children}
      </Typography>
    ),
    h2: ({ children }: any) => (
      <Typography variant="h2" gutterBottom>
        {children}
      </Typography>
    ),
    h3: ({ children }: any) => (
      <Typography variant="h3" gutterBottom>
        {children}
      </Typography>
    ),
    blockquote: ({ children }: any) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          my: 2,
          fontStyle: 'italic',
        }}
      >
        {children}
      </Box>
    ),
    image: ({ value }: any) => {
      const imageUrl = urlFor(value).url();
      return (
        <Box sx={{ my: 2 }}>
          <Image
            src={imageUrl}
            alt={value.alt || 'Image'}
            width={800}
            height={400}
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      );
    },
    code: ({ value }: any) => (
      <Box
        component="pre"
        sx={{
          bgcolor: 'grey.100',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
          my: 2,
        }}
      >
        <code>{value.code}</code>
      </Box>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    code: ({ children }: any) => (
      <Box
        component="code"
        sx={{
          bgcolor: 'grey.100',
          px: 1,
          py: 0.5,
          borderRadius: 0.5,
        }}
      >
        {children}
      </Box>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <Box component="ul" sx={{ pl: 2 }}>
        {children}
      </Box>
    ),
    number: ({ children }: any) => (
      <Box component="ol" sx={{ pl: 2 }}>
        {children}
      </Box>
    ),
  },
  types: {
    link: ({ value, children }: any) => {
      const target = value?.openInNewTab ? '_blank' : undefined;
      const rel = value?.openInNewTab ? 'noopener noreferrer' : undefined;
      return (
        <Link href={value?.href} target={target} rel={rel}>
          {children}
        </Link>
      );
    },
  },
};

export default function PortableText({ value }: PortableTextProps) {
  return (
    <Box sx={{ '& > *:first-of-type': { mt: 0 } }}>
      <PortableTextComponent value={value} components={components} />
    </Box>
  );
} 
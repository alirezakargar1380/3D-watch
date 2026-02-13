import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'src/components/iconify';

import { IPostItem } from 'src/types/blog';

import PostItem from './post-item';
import { PostItemSkeleton } from './post-skeleton';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
  loading?: boolean;
  disabledIndex?: boolean;
};

export default function PostList({ posts, loading, disabledIndex }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <Grid key={index} xs={12} sm={6} md={3}>
          <PostItemSkeleton />
        </Grid>
      ))}
    </>
  );

  const renderList = (
    <>
      {[...new Array(26)].map((post, index) => (
        <Grid key={index} xs={12} sm={6} md={!disabledIndex && index === 0 ? 6 : 3}>
          <PostItem post={{
            author: {
              name: 'alireza',
              avatarUrl: '/assets/images/ak.jpg',
            },
            content: 'hello',
            coverUrl: '/assets/images/unnamed.jpg',
            title: 'Clock History!',
            description: 'How Clocks Are made? and how their works',
            totalViews: 140000,
            totalComments: 890000,
            tags: ['historical'],
            comments: [
              {
                id: "1",
                avatarUrl: '',
                message: 'This a comment for test',
                name: 'User',
                postedAt: new Date(),
                replyComment: [],
                users: []
              }
            ]
          }} index={!disabledIndex ? index : undefined} />
        </Grid>
      ))}
    </>
  );

  return (
    <>
      <Grid container spacing={3}>
        {/* {loading ? renderSkeleton : renderList} */}
        {renderList}
      </Grid>

      {posts.length > 8 && (
        <Stack
          alignItems="center"
          sx={{
            mt: 8,
            mb: { xs: 10, md: 15 },
          }}
        >
          <Button
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="svg-spinners:12-dots-scale-rotate" width={24} />}
          >
            Load More
          </Button>
        </Stack>
      )}
    </>
  );
}

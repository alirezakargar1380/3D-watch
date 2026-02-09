'use client';

import { useScroll } from 'framer-motion';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import MainLayout from 'src/layouts/main';

import ScrollProgress from 'src/components/scroll-progress';

import HomeHero from '../home-hero';
import HomeMinimal from '../home-minimal';
import HomePricing from '../home-pricing';
import HomeDarkMode from '../home-dark-mode';
import HomeLookingFor from '../home-looking-for';
import HomeForDesigner from '../home-for-designer';
import HomeColorPresets from '../home-color-presets';
import HomeAdvertisement from '../home-advertisement';
import HomeCleanInterfaces from '../home-clean-interfaces';
import HomeHugePackElements from '../home-hugepack-elements';
import Image from 'src/components/image';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Container, Stack, Typography } from '@mui/material';
import CarouselBasic1 from 'src/sections/_examples/extra/carousel-view/carousel-basic-1';
import CarouselBasic2 from 'src/sections/_examples/extra/carousel-view/carousel-basic-2';
import CarouselBasic3 from 'src/sections/_examples/extra/carousel-view/carousel-basic-3';
import CarouselBasic4 from 'src/sections/_examples/extra/carousel-view/carousel-basic-4';
import { _mock } from 'src/_mock';
import ProductCarousel from 'src/sections/_examples/extra/carousel-view/product-carousel';
import AccordionView from 'src/sections/_examples/mui/accordion-view';
import Iconify from 'src/components/iconify';
import { useState } from 'react';

// ----------------------------------------------------------------------

type StyledPolygonProps = {
  anchor?: 'top' | 'bottom';
};

const StyledPolygon = styled('div')<StyledPolygonProps>(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));


const _carouselsExample = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.postTitle(index),
  coverUrl: _mock.image.cover(index),
  description: _mock.description(index),
}));

// ----------------------------------------------------------------------

const _accordions = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Accordion ${index + 1}`,
  subHeading: _mock.postTitle(index),
  detail: _mock.description(index),
}));

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  const [controlled, setControlled] = useState<string | false>(false);

  const handleChangeControlled =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setControlled(isExpanded ? panel : false);
    };

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />


      <Box sx={(theme) => ({
        mt: 10,
        position: 'relative',

        [theme.breakpoints.up('lg')]: {
          ml: `calc((100vw - ${theme.breakpoints.values.lg}px) / 2)`,
          mr: 'calc(-50vw + 50%)',
        },

        [theme.breakpoints.up('xl')]: {
          ml: `calc((100vw - ${theme.breakpoints.values.xl}px) / 2)`,
        },
      })}
      >
        <ProductCarousel data={_carouselsExample.slice(1, 20)} />
      </Box>
      <Container maxWidth={'xl'} sx={{
        mt: 30
      }}>
        <Box>
          {/* <Card>
            <CardHeader title="Carousel Basic 1" />
            <CardContent>
              <CarouselBasic1 data={_carouselsExample.slice(0, 4)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Carousel Basic 2" />
            <CardContent>
              <CarouselBasic2 data={_carouselsExample.slice(4, 8)} />
            </CardContent>
          </Card> */}



          {/* <Card>
            <CardHeader title="Carousel Basic 4" />
            <CardContent>
              <CarouselBasic4 data={_carouselsExample.slice(12, 16)} />
            </CardContent>
          </Card> */}
        </Box>

        <Box mb={3}>
          <Typography variant='h2'>Customize <span style={{ color: '#ff3d51' }}>Your Watch.</span></Typography>
        </Box>
        <Box bgcolor={'#d2d2d7a3'} borderRadius={'28px'}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Box pl={3} pt={0} width={'50%'}>
              {_accordions.map((item, index) => (
                <Accordion
                  key={item.value}
                  disabled={index === 3}
                  expanded={controlled === item.value}
                  onChange={handleChangeControlled(item.value)}
                >
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                    <Typography variant="h1" fontWeight={500} sx={{ width: '90%', flexShrink: 0 }}>
                      {item.heading}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{item.detail}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
            <Box height={750} width={'50%'} textAlign={'right'}>
              <Image src='/assets/images/Untitled7.png' py={3} width={'fit-content'} height={1} />
            </Box>

          </Stack>

        </Box>

        <Box mt={30}>
          <Typography color={"#6e6e73"} variant='h4' fontWeight={600}><span style={{ color: '#ff3d51' }}>Customize Watch.</span> Something You can't experience anywhere</Typography>
        </Box>

      </Container>

      {/* <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimal />

        <HomeHugePackElements />

        <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeForDesigner />
          <StyledPolygon anchor="bottom" />
        </Box>

        <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricing />

        <HomeLookingFor />

        <HomeAdvertisement />
      </Box> */}
    </MainLayout>
  );
}

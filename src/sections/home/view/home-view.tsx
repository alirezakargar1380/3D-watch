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
import { Typography } from '@mui/material';

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

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <Box mt={30} px={10} >
        <Typography mb={2} variant='h4'><span style={{ color: '#ff3d51' }}>The Latest.</span> All new and Lovable</Typography>
        <Box position={'relative'}>
          <Box position={'absolute'} pl={'30px'} pt={'30px'} zIndex={10}>
            <Typography color={'white'} variant={'h3'} pt={'24px'} fontSize={'28px!important'}>Clock 3D</Typography>
            <Box pt={'10px'}>
              <Typography color={'white'} variant={'body1'}>Pro Clock for Wall and Room</Typography>
              <Typography color={'white'} variant={'caption'}>low price & high quality</Typography>
            </Box>
          </Box>
          <Box width={400} height={500} borderRadius={'18px'} overflow={'hidden'}>
            <Image src='/assets/images/Untitled2.jpg' height={1} />
          </Box>
        </Box>

      </Box>

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

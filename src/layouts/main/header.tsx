import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';

import { paths } from 'src/routes/paths';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import Label from 'src/components/label';

import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import LoginButton from '../common/login-button';
import HeaderShadow from '../common/header-shadow';
import SettingsButton from '../common/settings-button';
import Iconify from 'src/components/iconify';
import { IconButton } from '@mui/material';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            // xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          // transition: theme.transitions.create(['height'], {
          //   easing: theme.transitions.easing.easeInOut,
          //   duration: theme.transitions.duration.shorter,
          // }),
          ...bgBlur({
            color: theme.palette.background.default,
          }),
          // ...(offsetTop && {
          //   ...bgBlur({
          //     color: theme.palette.background.default,
          //   }),
          //   height: {
          //     md: HEADER.H_DESKTOP_OFFSET,
          //   },
          // }),
        }}
      >
        <Container maxWidth={'xl'} sx={{ height: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Badge
            sx={{
              alignItems: 'center',
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
          >
            <Logo />
          </Badge>

          {/* <Box sx={{ flexGrow: 1 }} /> */}

          {mdUp && <NavDesktop data={navConfig} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>

            {/* {mdUp && <LoginButton />} */}

            <IconButton>
              <Iconify icon={'mingcute:user-1-line'} />
            </IconButton>

            <IconButton>
              <Iconify icon={'mdi:shopping-outline'} />
            </IconButton>

            {!mdUp && <NavMobile data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      <HeaderShadow />
      {/* {offsetTop && <HeaderShadow />} */}
    </AppBar>
  );
}

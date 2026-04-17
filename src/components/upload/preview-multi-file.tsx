import { m, AnimatePresence } from 'framer-motion';

import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/format-number';

import Iconify from '../iconify';
import { varFade } from '../animate';
import { UploadProps } from './types';
import FileThumbnail, { fileData } from '../file-thumbnail';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function MultiFilePreview({ thumbnail, files, mainImage, onRemove, onClick, sx }: UploadProps) {
  return (
    <AnimatePresence initial={false}>
      {files?.map((file, index: number) => {

        const { key, name = '', size = 0 } = fileData(file);
        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          return (
            <Stack
              key={index}
              // onClick={() => onClick(index, (index == mainImage))}
              component={m.div}
              /**
               *    TODO:
               *       - fix animation
               */
              // {...varFade().inUp}
              alignItems="center"
              display="inline-flex"
              justifyContent="center"
              sx={{
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                overflow: 'hidden',
                position: 'relative',
                outline: (index == mainImage) ? `solid 3px #18cb18` : ``,
                // border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                ...sx,
              }}
            >
              <Box onClick={() => onClick(index, (index == mainImage))} component={'div'}>
                <FileThumbnail
                  tooltip
                  imageView
                  file={file}
                  sx={{ position: 'absolute' }}
                  imgSx={{
                    position: 'absolute',
                    outline: (index == mainImage) ? `solid 3px #18cb18` : ``,
                    borderRadius: 1.25
                  }}
                />
              </Box>

              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(index, (index == mainImage))}
                  sx={{
                    p: 0.5,
                    top: 4,
                    right: 4,
                    position: 'absolute',
                    color: 'common.white',
                    // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    // ...(hoverImage === index) && ({
                    //   bgcolor: "#1bc424a9"
                    // }),
                    // '&:hover': {
                    //   bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    //   ...(hoverImage === index) && ({
                    //     bgcolor: "#1bc424a9"
                    //   }),
                    // },
                  }}
                >
                  <Iconify icon="iconamoon:cursor-fill" width={14} />
                </IconButton>
              )}
            </Stack>
          );
        }

        return (
          <Stack
            key={key}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
              border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
              ...sx,
            }}
          >
            <FileThumbnail file={file} />

            <ListItemText
              primary={isNotFormatFile ? file : name}
              secondary={isNotFormatFile ? '' : fData(size)}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(index, (index == mainImage))}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Stack>
        );
      })}
    </AnimatePresence >
  );
}
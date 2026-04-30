import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';

import Label from 'src/components/label';

import { IAddressItem } from 'src/types/address';

// ----------------------------------------------------------------------

type Props = PaperProps &
  StackProps & {
    action?: React.ReactNode;
    addressItem: IAddressItem;
  };

export default function AddressItem({ addressItem, action, sx, ...other }: Props) {
  const { name, address, city, phone, primary, post_code, state } = addressItem;

  return (
    <Stack
      component={Paper}
      spacing={2}
      alignItems={{ md: 'flex-end' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {name}
            {/* <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
              ({addressType})
            </Box> */}
          </Typography>

          {primary && (
            <Label color="info" sx={{ ml: 1 }}>
              آدرس اصلی
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {phone}
        </Typography>
      </Stack>

      {action && action}
    </Stack>
  );
}
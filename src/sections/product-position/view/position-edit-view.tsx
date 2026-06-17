'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetProduct } from 'src/api/product';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PositionNewEditForm from '../position-new-edit-form';
import { useGetPosition } from 'src/api/position';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PositionEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { position: currentPostion } = useGetPosition(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Position',
            href: paths.dashboard.productPosition.root,
          },
          { name: currentPostion?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PositionNewEditForm currentData={currentPostion} />
    </Container>
  );
}

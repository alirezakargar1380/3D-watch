import axios, { endpoints } from 'src/utils/axios';

import { ProductDetailsView } from 'src/sections/product/view';
import PositionEditView from 'src/sections/product-position/view/position-edit-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function PositionEditPage({ params }: Props) {
  const { id } = params;

  return <PositionEditView id={id} />;
}
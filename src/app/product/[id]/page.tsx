import ProductShopDetailsViewCustomize from 'src/sections/product/view/product-shop-details-view-customize';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Product: Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductShopDetailsPage({ params }: Props) {
  const { id } = params;

  return <ProductShopDetailsViewCustomize id={id} />;
}